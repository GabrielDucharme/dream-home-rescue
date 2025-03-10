'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PawIcon } from '@/components/icons'
import { trackEvent } from '@/utilities/analytics'

// Metadata moved to a separate page-level metadata file since this is now a client component

export default function ThankYouPage() {
  useEffect(() => {
    // Track donation completion event on page load
    trackEvent('donation_completed', { 
      page: 'thank_you'
    })
  }, [])

  return (
    <div className="container py-16 md:py-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <PawIcon className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl md:text-3xl mb-2">Merci pour votre don!</CardTitle>
          <p className="text-muted-foreground">
            Votre générosité aidera à sauver des chiens dans le besoin et à leur trouver des foyers aimants.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Nous avons envoyé un reçu à l'adresse courriel que vous avez fournie.
            Si vous avez des questions concernant votre don, n'hésitez pas à nous contacter.
          </p>
          
          <div className="bg-secondary/20 p-4 rounded-lg">
            <p className="text-primary font-medium mb-2">Votre impact</p>
            <p className="text-sm text-muted-foreground">
              Chaque don nous aide à fournir de la nourriture, des soins vétérinaires et un abri temporaire
              aux chiens dans le besoin. Grâce à vous, nous pourrons continuer notre mission.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
          <Button asChild>
            <Link href="/">
              Retour à l'accueil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dogs">
              Voir les chiens disponibles
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}