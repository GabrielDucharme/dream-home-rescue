import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import { MapPin, Calendar, ArrowRight, Clock, Users } from 'lucide-react'

// Import shadcn components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-static'
export const revalidate = 600

// Function to format date in French
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  
  // Format options
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }
  
  return date.toLocaleDateString('fr-CA', options)
}

// Function to format time
function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('fr-CA', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  })
}

// Function to check if an event is upcoming
function isUpcoming(dateStr: string): boolean {
  const eventDate = new Date(dateStr)
  const now = new Date()
  return eventDate > now
}

export default async function EventsPage() {
  const payload = await getPayload({ config: configPromise })

  const eventsResponse = await payload.find({
    collection: 'funding-events',
    depth: 1,
    limit: 100,
    sort: 'eventDate',
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  const allEvents = eventsResponse.docs || []
  
  // Separate events into upcoming and past
  const upcomingEvents = allEvents.filter(event => isUpcoming(event.eventDate))
  const pastEvents = allEvents.filter(event => !isUpcoming(event.eventDate))
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()) // Sort past events newest to oldest

  const hasUpcomingEvents = upcomingEvents.length > 0
  const hasPastEvents = pastEvents.length > 0

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-10">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-4">Événements</Badge>
          <h1 className="text-4xl font-serif font-bold mb-3">Événements de financement</h1>
          <p className="text-muted-foreground text-lg">Joignez-vous à nous lors de nos événements pour soutenir notre mission de sauvetage et d'adoption.</p>
        </div>
      </div>
      
      <div className="container">
        <Tabs defaultValue="upcoming" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Événements à venir</TabsTrigger>
            <TabsTrigger value="past">Événements passés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {hasUpcomingEvents ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden group h-full flex flex-col hover:shadow-md transition-all">
                    {event.mainImage && typeof event.mainImage !== 'string' && (
                      <div className="relative aspect-video overflow-hidden">
                        <Media 
                          resource={event.mainImage}
                          alt={event.title}
                          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          fill
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="flame" className="bg-flame text-white">
                            Événement à venir
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="pt-6 flex-grow">
                      <div className="flex flex-wrap gap-3 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.eventDate)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
                          <Clock className="h-3 w-3" />
                          {formatTime(event.eventDate)}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                      
                      {event.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location.name}, {event.location.city}</span>
                        </div>
                      )}
                      
                      <CardDescription className="mb-4 text-base">
                        {event.shortDescription}
                      </CardDescription>
                    </CardContent>
                    
                    <CardFooter className="pt-0 mt-auto">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/evenements/${event.slug}`}>
                          En savoir plus
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert className="bg-muted border">
                <AlertDescription className="text-center py-8">
                  Aucun événement à venir pour le moment. Revenez bientôt pour découvrir nos prochains événements.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {hasPastEvents ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden group h-full flex flex-col hover:shadow-md transition-all opacity-80 hover:opacity-100">
                    {event.mainImage && typeof event.mainImage !== 'string' && (
                      <div className="relative aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <Media 
                          resource={event.mainImage}
                          alt={event.title}
                          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          fill
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-secondary/80 backdrop-blur-sm">
                            Événement passé
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="pt-6 flex-grow">
                      <div className="flex flex-wrap gap-3 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.eventDate)}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                      
                      {event.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location.name}, {event.location.city}</span>
                        </div>
                      )}
                      
                      <CardDescription className="mb-4 text-base">
                        {event.shortDescription}
                      </CardDescription>
                    </CardContent>
                    
                    <CardFooter className="pt-0 mt-auto">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/evenements/${event.slug}`}>
                          Voir le récapitulatif
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert className="bg-muted border">
                <AlertDescription className="text-center py-8">
                  Aucun événement passé n'est disponible pour le moment.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
        
        <Separator className="my-12" />
        
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Vous souhaitez organiser un événement?</h2>
          <p className="text-muted-foreground mb-6">
            Nous sommes toujours à la recherche de partenaires pour organiser des événements de financement. 
            Si vous êtes intéressé à nous aider, contactez-nous!
          </p>
          <Button size="lg" variant="flame" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Événements de financement | Dream Home Rescue',
    description: 'Découvrez et rejoignez nos événements de financement pour soutenir notre mission de sauvetage et d\'adoption de chiens.',
  }
}