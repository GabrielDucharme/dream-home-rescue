import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Stripe from 'stripe'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    // Initialize Payload first
    const payload = await getPayload({ config: configPromise })
    
    // Parse the request body, with proper error handling
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      console.log('Request content-type:', req.headers.get('content-type'));
      
      // Check if this might be a form submission
      if (req.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
        const text = await req.text();
        console.log('Form data received:', text);
        return NextResponse.json(
          { error: 'Form data received instead of JSON. Please use JSON format.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Invalid request format. Expected JSON.' },
        { status: 400 }
      );
    }
    
    // Get the referer to validate the request is coming from our site
    const headersList = headers();
    const referer = headersList.get('referer');
    const origin = process.env.NEXT_PUBLIC_SERVER_URL;
    
    // Log the request data for debugging
    console.log('Donation request received:', { 
      referer, 
      origin,
      contentType: req.headers.get('content-type'),
      body: JSON.stringify(body).substring(0, 100) + '...' // Log part of the body
    });
    
    // Skip referer check in development or if specifically allowed
    const skipRefererCheck = process.env.NODE_ENV === 'development' || process.env.SKIP_REFERER_CHECK === 'true';
    
    // Simple security check - only accept requests from our site
    if (!skipRefererCheck && (!referer || !origin || !referer.startsWith(origin))) {
      console.warn('Invalid donation request referer:', referer);
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }
    
    // Extract donation data from request
    const { donorName, email, amount, donationType, acceptTerms } = body
    
    // Validate required fields
    if (!donorName || !email || !amount || !donationType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate email
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Validate terms acceptance
    if (!acceptTerms) {
      return NextResponse.json(
        { error: 'You must accept the terms and conditions' },
        { status: 400 }
      );
    }
    
    // Validate amount and convert to number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Please provide a positive number.' },
        { status: 400 }
      );
    }
    
    // Calculate the amount in cents for Stripe (minimum 50 cents)
    const amountInCents = Math.max(Math.round(numericAmount * 100), 50)
    
    // Initialize Stripe with latest API version
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia', // Latest API version
    })
    
    // Check if a customer with this email already exists in Stripe
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      // Use existing customer
      customer = existingCustomers.data[0];
      console.log('Using existing Stripe customer:', customer.id);
      
      // Update customer name if needed
      if (customer.name !== donorName) {
        customer = await stripe.customers.update(customer.id, {
          name: donorName,
        });
      }
    } else {
      // Create a new customer in Stripe
      customer = await stripe.customers.create({
        name: donorName,
        email: email,
        metadata: {
          source: 'dhr-website-donation',
          donationType: donationType,
        },
      });
      console.log('Created new Stripe customer:', customer.id);
    }
    
    // Determine the checkout mode based on donation type
    const mode = donationType === 'onetime' ? 'payment' : 'subscription'
    
    // Prepare line items based on donation type
    const lineItems = donationType === 'onetime'
      ? [
          {
            price_data: {
              currency: 'cad',
              product_data: {
                name: 'Don à DHR',
                description: 'Votre contribution aide à sauver des chiens dans le besoin',
                metadata: {
                  type: 'onetime'
                }
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: 'cad',
              product_data: {
                name: 'Don mensuel à DHR',
                description: 'Votre contribution mensuelle aide à sauver des chiens dans le besoin',
                metadata: {
                  type: 'monthly'
                }
              },
              unit_amount: amountInCents,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ]
    
    // Create a checkout session using Stripe SDK directly
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: mode,
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/merci-pour-votre-don?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
      metadata: {
        donationType,
        donorName,
        donorEmail: email
      },
      payment_intent_data: donationType === 'onetime' ? {
        metadata: {
          donationType,
          donorName,
          donorEmail: email
        }
      } : undefined,
      subscription_data: donationType === 'monthly' ? {
        metadata: {
          donationType,
          donorName,
          donorEmail: email
        }
      } : undefined,
    })
    
    console.log('Stripe session created:', {
      id: session.id,
      url: session.url,
      customer: customer.id,
      mode: mode,
      subscription: session.subscription,
    })
    
    // Find or create customer in Payload CMS
    let payloadCustomer;
    
    // Try to find existing customer by email
    const existingPayloadCustomers = await payload.find({
      collection: 'customers',
      where: {
        email: { equals: email },
      },
      limit: 1,
    });
    
    if (existingPayloadCustomers.docs.length > 0) {
      // Use existing customer
      payloadCustomer = existingPayloadCustomers.docs[0];
      console.log('Using existing Payload customer:', payloadCustomer.id);
      
      // Update customer if needed
      if (payloadCustomer.name !== donorName) {
        payloadCustomer = await payload.update({
          collection: 'customers',
          id: payloadCustomer.id,
          data: {
            name: donorName,
            // Keep Stripe ID in sync
            stripeCustomerID: customer.id,
          },
        });
      }
    } else {
      // Create new customer in Payload CMS
      payloadCustomer = await payload.create({
        collection: 'customers',
        data: {
          name: donorName,
          email,
          stripeCustomerID: customer.id,
          createdAt: new Date().toISOString(),
        },
      });
      console.log('Created new Payload customer:', payloadCustomer.id);
    }
    
    // Create donation record in Payload CMS
    const donation = await payload.create({
      collection: 'donations',
      data: {
        donorName,
        email,
        amount: numericAmount,
        donationType,
        acceptTerms,
        stripeCustomerID: customer.id,
        stripePaymentStatus: 'pending',
        // Create relationship with customer
        customer: payloadCustomer.id,
        ...(mode === 'subscription' && session.subscription 
          ? { stripeSubscriptionID: session.subscription } 
          : {})
      },
    })
    
    // Update customer with relationship to this donation and update totals
    const currentTotal = payloadCustomer.totalDonated || 0;
    const currentCount = payloadCustomer.donationCount || 0;
    
    await payload.update({
      collection: 'customers',
      id: payloadCustomer.id,
      data: {
        // Add this donation to customer's donations array
        donations: [...(payloadCustomer.donations || []), donation.id],
        // Update the total amount donated
        totalDonated: currentTotal + numericAmount,
        // Increment the donation count
        donationCount: currentCount + 1,
      },
    });
    
    // Return the Stripe checkout URL and donation ID
    return NextResponse.json({ 
      success: true, 
      donationId: donation.id,
      checkoutUrl: session.url,
    })
  } catch (error: any) {
    console.error('Error processing donation:', error)
    // Log more detailed information for debugging
    if (error.response) {
      console.error('Error response data:', error.response.data)
      console.error('Error response status:', error.response.status)
    } else if (error.request) {
      console.error('Error request:', error.request)
    } else {
      console.error('Error message:', error.message)
    }
    console.error('Error stack:', error.stack)
    
    return NextResponse.json(
      { error: error.message || 'Error processing donation', details: typeof error === 'object' ? JSON.stringify(error) : 'Unknown error' },
      { status: 500 }
    )
  }
}