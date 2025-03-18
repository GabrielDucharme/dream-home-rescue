// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Customers } from './collections/Customers'
import { Dogs } from './collections/Dogs'
import { DonationGoals } from './collections/DonationGoals'
import { Donations } from './collections/Donations'
import { FundingEvents } from './collections/FundingEvents'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { Posts } from './collections/Posts'
import { Services } from './collections/Services'
import { SuccessStories } from './collections/SuccessStories'
import { TeamMembers } from './collections/TeamMembers'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { PartnerLogos } from './blocks/PartnerLogos/config'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { fr } from '@payloadcms/translations/languages/fr'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { stripePlugin } from '@payloadcms/plugin-stripe'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  email: () => ({
    transport: {
      host: 'smtp.resend.com',
      secure: true,
      port: 465,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    },
    fromName: 'Dream Home Rescue',
    fromAddress: 'info@dreamhomerescue.com',
  }),
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: {fr},
  },
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [Pages, Posts, Dogs, SuccessStories, Media, Categories, TeamMembers, Users, Services, DonationGoals, Donations, Customers, FundingEvents, Partners],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    vercelBlobStorage({
      enabled: process.env.NODE_ENV === 'production',
      collections: {
        media: {
          disableLocalStorage: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    // Enable Stripe plugin with webhook support
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET,
      logs: process.env.NODE_ENV !== 'production',
      stripeConfig: {
        apiVersion: '2024-07-16', // Use the latest stable API version
        typescript: true,
      },
      webhooks: {
        'checkout.session.completed': async ({ event, stripe, payload }) => {
          // Process completed checkout session
          const session = event.data.object;
          
          try {
            console.log('Checkout session completed webhook received:', session.id);
            
            // Find the donation record by customer or session metadata
            const donations = await payload.find({
              collection: 'donations',
              where: {
                stripeCustomerID: { equals: session.customer },
              },
              sort: '-createdAt',
              limit: 1,
            });
            
            if (donations.docs.length > 0) {
              const donation = donations.docs[0];
              
              // Update donation status
              await payload.update({
                collection: 'donations',
                id: donation.id,
                data: {
                  stripePaymentStatus: 'completed',
                  // If subscription, store subscription ID
                  ...(session.subscription ? { stripeSubscriptionID: session.subscription } : {}),
                },
              });
              
              console.log(`Donation ${donation.id} marked as completed`);
              
              // Update customer donation totals and statistics
              if (donation.customer) {
                console.log(`Customer ${donation.customer} has a completed donation`);
                
                // Get the full donation data to ensure we have the amount
                const fullDonation = await payload.findByID({
                  collection: 'donations',
                  id: donation.id,
                });
                
                console.log('Full donation data:', fullDonation);
                
                // Get current customer data
                const customer = await payload.findByID({
                  collection: 'customers',
                  id: donation.customer,
                });
                
                const donationAmount = fullDonation.amount || 0;
                
                // Update donation statistics
                await payload.update({
                  collection: 'customers',
                  id: donation.customer,
                  data: {
                    totalDonated: (customer.totalDonated || 0) + donationAmount,
                    donationCount: (customer.donationCount || 0) + 1,
                  },
                });
                
                console.log(`Updated stats for customer ${donation.customer}: total=${(customer.totalDonated || 0) + donationAmount}, count=${(customer.donationCount || 0) + 1}`);
              }
            } else {
              console.warn('No matching donation found for checkout session:', session.id);
            }
          } catch (error) {
            console.error('Error processing checkout.session.completed webhook:', error);
          }
        },
        'payment_intent.payment_failed': async ({ event, stripe, payload }) => {
          // Handle failed payments
          const paymentIntent = event.data.object;
          console.log('Payment failed webhook received:', paymentIntent.id);
          
          try {
            // Find donations with this customer ID
            const customerID = paymentIntent.customer;
            if (customerID) {
              const donations = await payload.find({
                collection: 'donations',
                where: {
                  stripeCustomerID: { equals: customerID },
                },
                sort: '-createdAt',
                limit: 1,
              });
              
              if (donations.docs.length > 0) {
                const donation = donations.docs[0];
                await payload.update({
                  collection: 'donations',
                  id: donation.id,
                  data: {
                    stripePaymentStatus: 'failed',
                  },
                });
                console.log(`Donation ${donation.id} marked as failed`);
              }
            }
          } catch (error) {
            console.error('Error processing payment_intent.payment_failed webhook:', error);
          }
        },
        'customer.subscription.deleted': async ({ event, stripe, payload }) => {
          // Handle subscription cancellations
          const subscription = event.data.object;
          console.log('Subscription deleted webhook received:', subscription.id);
          
          try {
            // Find donations with this subscription ID
            const donations = await payload.find({
              collection: 'donations',
              where: {
                stripeSubscriptionID: { equals: subscription.id },
              },
            });
            
            if (donations.docs.length > 0) {
              for (const donation of donations.docs) {
                await payload.update({
                  collection: 'donations',
                  id: donation.id,
                  data: {
                    stripePaymentStatus: 'cancelled',
                  },
                });
                console.log(`Donation ${donation.id} with subscription marked as cancelled`);
              }
            }
          } catch (error) {
            console.error('Error processing customer.subscription.deleted webhook:', error);
          }
        }
      }
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
