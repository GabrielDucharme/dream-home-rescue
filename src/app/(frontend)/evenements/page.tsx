import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'

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

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose max-w-none">
          <h1>Événements de financement</h1>
          <p>Joignez-vous à nous lors de nos événements pour soutenir notre mission de sauvetage et d'adoption.</p>
        </div>
      </div>

      <div className="container">
        {/* Upcoming Events */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-8">Événements à venir</h2>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Link 
                  key={event.id}
                  href={`/evenements/${event.slug}`}
                  className="block group"
                >
                  <div className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow h-full flex flex-col">
                    {event.mainImage && typeof event.mainImage !== 'string' && (
                      <div className="relative aspect-video overflow-hidden">
                        <Media 
                          resource={event.mainImage}
                          alt={event.title}
                          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          fill
                        />
                      </div>
                    )}
                    
                    <div className="p-6 flex-grow">
                      <div className="flex items-center gap-1 text-sm text-flame font-medium mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                      
                      {event.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location.name}, {event.location.city}</span>
                        </div>
                      )}
                      
                      <p className="text-muted-foreground mb-4">{event.shortDescription}</p>
                      
                      <div className="mt-auto pt-2">
                        <span className="inline-flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                          En savoir plus
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-muted p-8 rounded-lg text-center">
              <p className="text-muted-foreground">
                Aucun événement à venir pour le moment. Revenez bientôt pour découvrir nos prochains événements.
              </p>
            </div>
          )}
        </div>
        
        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-bold mb-8">Événements passés</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <Link 
                  key={event.id}
                  href={`/evenements/${event.slug}`}
                  className="block group"
                >
                  <div className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow h-full flex flex-col opacity-80 hover:opacity-100">
                    {event.mainImage && typeof event.mainImage !== 'string' && (
                      <div className="relative aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <Media 
                          resource={event.mainImage}
                          alt={event.title}
                          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          fill
                        />
                      </div>
                    )}
                    
                    <div className="p-6 flex-grow">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                      
                      {event.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location.name}, {event.location.city}</span>
                        </div>
                      )}
                      
                      <p className="text-muted-foreground mb-4">{event.shortDescription}</p>
                      
                      <div className="mt-auto pt-2">
                        <span className="inline-flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                          Voir le récapitulatif
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
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