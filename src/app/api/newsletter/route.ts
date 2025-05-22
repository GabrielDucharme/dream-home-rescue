import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email, firstName, lastName } = data

    if (!email) {
      return NextResponse.json({ error: "L'adresse courriel est requise" }, { status: 400 })
    }

    // Initialize Payload
    const payloadClient = await getPayloadHMR({ config: await import('@/payload.config') })

    // Check if email already exists
    const existingSubscriptions = await payloadClient.find({
      collection: 'newsletter-subscriptions',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingSubscriptions.docs.length > 0) {
      const subscription = existingSubscriptions.docs[0]

      // If already subscribed and active, return success
      if (subscription.status === 'active') {
        return NextResponse.json({
          success: true,
          message: 'Vous êtes déjà abonné(e) à notre infolettre.',
          alreadySubscribed: true,
        })
      }

      // If unsubscribed, reactivate the subscription
      await payloadClient.update({
        collection: 'newsletter-subscriptions',
        id: subscription.id,
        data: {
          status: 'active',
          subscribedAt: new Date().toISOString(),
          unsubscribedAt: null,
          // Update name fields if provided
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Bon retour ! Votre abonnement a été réactivé.',
        reactivated: true,
      })
    }

    // Create new subscription
    const newSubscription = await payloadClient.create({
      collection: 'newsletter-subscriptions',
      data: {
        email,
        status: 'active',
        source: 'website',
        subscribedAt: new Date().toISOString(),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Merci de vous être abonné(e) à notre infolettre !',
      subscription: {
        id: newSubscription.id,
        email: newSubscription.email,
      },
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)

    // Handle unique constraint error
    if (error.message?.includes('duplicate key')) {
      return NextResponse.json({
        success: true,
        message: 'Vous êtes déjà abonné(e) à notre infolettre.',
        alreadySubscribed: true,
      })
    }

    return NextResponse.json(
      { error: "Une erreur s'est produite. Veuillez réessayer plus tard." },
      { status: 500 },
    )
  }
}
