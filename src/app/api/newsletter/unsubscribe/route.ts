import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email } = data

    if (!email) {
      return NextResponse.json({ error: "L'adresse courriel est requise" }, { status: 400 })
    }

    // Initialize Payload
    const payloadClient = await getPayloadHMR({ config: await import('@/payload.config') })

    // Find the subscription
    const subscriptions = await payloadClient.find({
      collection: 'newsletter-subscriptions',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (subscriptions.docs.length === 0) {
      return NextResponse.json(
        { error: 'Adresse courriel introuvable dans nos dossiers' },
        { status: 404 },
      )
    }

    const subscription = subscriptions.docs[0]

    // Update subscription status
    await payloadClient.update({
      collection: 'newsletter-subscriptions',
      id: subscription.id,
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Vous avez été désabonné(e) avec succès de notre infolettre.',
    })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)

    return NextResponse.json(
      { error: "Une erreur s'est produite lors du désabonnement. Veuillez réessayer plus tard." },
      { status: 500 },
    )
  }
}
