import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import RichText from '@/components/RichText'
import { formatDateTime } from '@/utilities/formatDateTime'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { MapPin, Calendar, Clock, Users, ExternalLink, ArrowRight } from 'lucide-react'
import { EventRegistrationForm } from './EventRegistrationForm.client'

// Define the page props
type EventPageProps = {
  params: {
    slug: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params: paramsPromise }: { params: EventPageProps['params'] }): Promise<Metadata> {
  const params = await Promise.resolve(paramsPromise)
  const event = await getEventBySlug(params.slug)
  
  if (!event) {
    return {
      title: "Événement non trouvé | Dream Home Rescue",
      description: "L'événement demandé n'existe pas.",
    }
  }

  // Base URL for API
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  
  // Create OG image URL with query parameters
  const ogImageUrl = new URL(`${baseUrl}/api/og`)
  ogImageUrl.searchParams.set('title', event.title)
  ogImageUrl.searchParams.set('type', 'event')
  
  // Add image parameter if available
  if (event.mainImage?.url) {
    ogImageUrl.searchParams.set('image', `${baseUrl}${event.mainImage.url}`)
  }

  // Format date for sharing
  const eventDate = new Date(event.eventDate).toLocaleDateString('fr-CA', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  })
  
  // Format time for display
  const eventTime = new Date(event.eventDate).toLocaleTimeString('fr-CA', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  })
  
  // Add subtitle with event short description
  if (event.shortDescription) {
    ogImageUrl.searchParams.set('subtitle', event.shortDescription)
  }
  
  // Add extra data with date and location
  const extraData = `${eventDate} à ${eventTime}${event.location?.city ? ` • ${event.location.city}` : ''}`
  ogImageUrl.searchParams.set('extraData', extraData)

  const title = event.meta?.title || `${event.title} | Dream Home Rescue`
  const description = event.meta?.description || event.shortDescription || `Événement de financement: ${event.title}`

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${event.title} - ${eventDate} | Dream Home Rescue`,
      description: description,
      type: 'website', // Must be a valid OG type: website, article, book, profile, etc.
      url: `${baseUrl}/evenements/${params.slug}`,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: event.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} - ${eventDate}`,
      description: description,
      images: [ogImageUrl.toString()],
    }
  }
}

// Get the event data from the database
async function getEventBySlug(slug: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const { docs } = await payload.find({
      collection: 'funding-events',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'published',
        },
      },
      depth: 2,
    })

    return docs[0] || null
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

// Determine if registration is still open
function isRegistrationOpen(event: any): boolean {
  if (!event.registrationEnabled) return false
  
  if (event.registrationDeadline) {
    const deadlineDate = new Date(event.registrationDeadline)
    const now = new Date()
    if (now > deadlineDate) return false
  }
  
  // If the event has already happened, registration is closed
  const eventDate = new Date(event.eventDate)
  const now = new Date()
  if (now > eventDate) return false
  
  return true
}

// Main page component
export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug)
  
  // If no event is found, return 404
  if (!event) {
    notFound()
  }
  
  const registrationOpen = isRegistrationOpen(event)
  const hasTicketOptions = event.ticketOptions && event.ticketOptions.length > 0
  const hasFAQ = event.faq && event.faq.length > 0
  const hasSponsors = event.sponsors && event.sponsors.length > 0
  const hasGallery = event.galleryImages && event.galleryImages.length > 0
  
  // Format dates for display
  const eventDateFormatted = formatDateTime(event.eventDate)
  let eventTimeStr = new Date(event.eventDate).toLocaleTimeString('fr-CA', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  })
  
  let endDateStr = ''
  if (event.endDate) {
    endDateStr = formatDateTime(event.endDate)
  }
  
  return (
    <div className="pt-24 pb-16">
      {/* Event Hero Section */}
      <div className="relative mb-12">
        {event.mainImage && (
          <>
            {/* Mobile hero - taller height to contain all content */}
            <div className="md:hidden absolute inset-0 z-0">
              <div className="relative h-[420px] w-full overflow-hidden">
                <Media 
                  resource={event.mainImage}
                  fill
                  imgClassName="object-cover"
                  sizes="100vw"
                  alt={event.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/30"></div>
              </div>
            </div>
            
            {/* Desktop hero - taller height */}
            <div className="hidden md:block absolute inset-0 z-0">
              <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden">
                <Media 
                  resource={event.mainImage}
                  fill
                  imgClassName="object-cover"
                  sizes="100vw"
                  alt={event.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
              </div>
            </div>
          </>
        )}
        
        <div className="container relative z-10">
          {/* Adjusted padding for better mobile experience */}
          <div className="pt-10 pb-14 md:pt-24 md:pb-24">
            <div className="max-w-3xl mx-auto text-center text-white">
              {/* Event type label with improved mobile spacing */}
              <div className="inline-block bg-flame text-white text-xs md:text-sm font-medium px-2.5 py-1 md:px-3 md:py-1 rounded-full mb-3 md:mb-5">
                Événement de financement
              </div>
              
              {/* Title with improved font sizes for mobile */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 md:mb-4 drop-shadow-sm">{event.title}</h1>
              
              {/* Description with better responsive spacing */}
              <p className="text-base md:text-lg mb-6 md:mb-8 text-white/90 max-w-2xl mx-auto px-3 md:px-0">{event.shortDescription}</p>
              
              {/* Event details card with improved mobile layout */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 md:gap-8 text-white/90 bg-black/20 backdrop-blur-sm rounded-xl p-4 md:p-5 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-white/70">Date</div>
                    <span className="text-sm font-medium">{eventDateFormatted}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-white/70">Heure</div>
                    <span className="text-sm font-medium">{eventTimeStr}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-xs text-white/70">Lieu</div>
                    <span className="text-sm font-medium">{event.location?.name}, {event.location?.city}</span>
                  </div>
                </div>
              </div>
              
              {/* Registration button with fixed position */}
              {registrationOpen && (
                <div className="fixed bottom-4 left-0 right-0 z-50 px-4 md:static md:mt-8 md:px-0">
                  <a 
                    href="#inscription" 
                    className="bg-flame hover:bg-flame/90 text-white font-medium rounded-md px-5 py-2.5 md:px-6 md:py-3 flex items-center justify-center w-full md:inline-flex md:w-auto transition-colors shadow-md hover:shadow-lg"
                  >
                    Je m'inscris maintenant
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="prose max-w-none mb-12">
              <RichText data={event.description} />
            </div>
            
            {/* Ticket options */}
            {hasTicketOptions && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold">Options de participation</h2>
                  {registrationOpen && (
                    <a 
                      href="#inscription" 
                      className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 text-sm"
                    >
                      Voir l'inscription <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {event.ticketOptions.map((ticket: any, i: number) => (
                    <div 
                      key={i} 
                      className={`bg-card border rounded-lg overflow-hidden flex flex-col h-full group hover:shadow-md transition-shadow ${
                        i === 0 ? 'border-primary/40 bg-primary/5' : 'border-border'
                      }`}
                    >
                      {i === 0 && (
                        <div className="bg-primary text-white text-xs font-medium py-1 px-3 text-center">
                          Option recommandée
                        </div>
                      )}
                      
                      <div className="p-6 flex-grow">
                        <div className="flex flex-col mb-4">
                          <span className="text-2xl font-bold mb-1">{ticket.price ? `${ticket.price} $` : 'Gratuit'}</span>
                          <h3 className="text-lg font-bold">{ticket.name}</h3>
                        </div>
                        
                        {ticket.description && (
                          <p className="text-muted-foreground flex-grow">{ticket.description}</p>
                        )}
                      </div>
                      
                      <div className="p-6 pt-0 border-t border-border/40 mt-auto">
                        {ticket.maxQuantity && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                            <Users className="h-4 w-4" />
                            <span>Limité à {ticket.maxQuantity} participations</span>
                          </div>
                        )}
                        
                        {registrationOpen ? (
                          <a 
                            href="#inscription" 
                            className={`w-full block text-center py-2 px-4 rounded-md font-medium transition-colors ${
                              i === 0 
                                ? 'bg-flame hover:bg-flame/90 text-white' 
                                : 'bg-muted hover:bg-muted-foreground/10 text-foreground'
                            }`}
                          >
                            Choisir cette option
                          </a>
                        ) : (
                          <div className="w-full block text-center py-2 px-4 rounded-md font-medium bg-muted text-muted-foreground cursor-not-allowed">
                            Non disponible
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sponsors */}
            {hasSponsors && (
              <div className="mb-12">
                <h2 className="text-2xl font-serif font-bold mb-6">Nos commanditaires</h2>
                
                {/* Platinum sponsors */}
                {event.sponsors.filter((s: any) => s.sponsorLevel === 'platinum').length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Commanditaires Platine</h3>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {event.sponsors
                        .filter((s: any) => s.sponsorLevel === 'platinum')
                        .map((sponsor: any, i: number) => (
                          <div key={i} className="flex flex-col items-center text-center">
                            {sponsor.logo ? (
                              <div className="mb-3 h-24 w-full relative">
                                <Media 
                                  resource={sponsor.logo}
                                  imgClassName="object-contain"
                                  alt={sponsor.name}
                                  fill
                                />
                              </div>
                            ) : (
                              <div className="mb-3 font-bold text-xl">{sponsor.name}</div>
                            )}
                            
                            {sponsor.website && (
                              <a 
                                href={sponsor.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm mt-1"
                              >
                                Visiter le site <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                {/* Gold sponsors */}
                {event.sponsors.filter((s: any) => s.sponsorLevel === 'gold').length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Commanditaires Or</h3>
                    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
                      {event.sponsors
                        .filter((s: any) => s.sponsorLevel === 'gold')
                        .map((sponsor: any, i: number) => (
                          <div key={i} className="flex flex-col items-center text-center">
                            {sponsor.logo ? (
                              <div className="mb-2 h-16 w-full relative">
                                <Media 
                                  resource={sponsor.logo}
                                  imgClassName="object-contain"
                                  alt={sponsor.name}
                                  fill
                                />
                              </div>
                            ) : (
                              <div className="mb-2 font-bold">{sponsor.name}</div>
                            )}
                            
                            {sponsor.website && (
                              <a 
                                href={sponsor.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm mt-1"
                              >
                                Site web <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                {/* Other sponsors */}
                {event.sponsors.filter((s: any) => !['platinum', 'gold'].includes(s.sponsorLevel || '')).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Autres commanditaires</h3>
                    <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
                      {event.sponsors
                        .filter((s: any) => !['platinum', 'gold'].includes(s.sponsorLevel || ''))
                        .map((sponsor: any, i: number) => (
                          <li key={i}>
                            <span className="font-medium">{sponsor.name}</span>
                            {sponsor.sponsorLevel && (
                              <span className="text-sm text-muted-foreground ml-2">
                                ({sponsor.sponsorLevel === 'silver' ? 'Argent' : 
                                  sponsor.sponsorLevel === 'bronze' ? 'Bronze' : 'Soutien'})
                              </span>
                            )}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* FAQ */}
            {hasFAQ && (
              <div className="mb-12">
                <h2 className="text-2xl font-serif font-bold mb-6">Questions fréquentes</h2>
                <div className="space-y-6">
                  {event.faq.map((item: any, i: number) => (
                    <div key={i} className="border-b border-border pb-6 last:border-0">
                      <h3 className="text-lg font-bold mb-2">{item.question}</h3>
                      <div className="prose-sm max-w-none">
                        <RichText data={item.answer} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Gallery */}
            {hasGallery && (
              <div className="mb-12">
                <h2 className="text-2xl font-serif font-bold mb-6">Galerie</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.galleryImages.map((item: any, i: number) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      <Media 
                        resource={item.image}
                        fill
                        imgClassName="object-cover hover:scale-105 transition-transform duration-300"
                        alt={item.caption || `Image ${i+1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              {/* Event Details Card */}
              <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-primary">Détails de l'événement</h2>
                  
                  <div className="space-y-6 divide-y divide-border">
                    <div className="pb-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg mb-1">Date et heure</h3>
                          <p className="font-medium">{eventDateFormatted}</p>
                          <p className="text-muted-foreground">{eventTimeStr}</p>
                          {endDateStr && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Jusqu'au {endDateStr}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg mb-1">Emplacement</h3>
                          <p className="font-medium">{event.location?.name}</p>
                          <p className="text-muted-foreground">
                            {event.location?.address}<br />
                            {event.location?.city}, {event.location?.postalCode}
                          </p>
                          {event.location?.googleMapsUrl && (
                            <a 
                              href={event.location.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm mt-2 hover:gap-2 transition-all"
                            >
                              Voir sur Google Maps <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {event.organizers && event.organizers.length > 0 && (
                      <div className="pt-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg mb-2">Organisateurs</h3>
                            <ul className="space-y-3">
                              {event.organizers.map((organizer: any, i: number) => (
                                <li key={i} className={i > 0 ? "border-t border-border/50 pt-3" : ""}>
                                  <p className="font-medium">{organizer.name}</p>
                                  {organizer.role && (
                                    <p className="text-muted-foreground">{organizer.role}</p>
                                  )}
                                  {organizer.contact && (
                                    <a 
                                      href={`mailto:${organizer.contact}`}
                                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm mt-1"
                                    >
                                      {organizer.contact}
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Add quick action buttons */}
                  <div className="mt-6 pt-6 border-t border-border">
                    {hasTicketOptions && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>Prix:</span>
                        <span className="font-medium text-foreground">
                          {event.ticketOptions[0]?.price ? `À partir de ${event.ticketOptions[0].price} $` : 'Gratuit'}
                        </span>
                      </div>
                    )}
                    
                    {registrationOpen && (
                      <a 
                        href="#inscription" 
                        className="bg-flame hover:bg-flame/90 text-white font-medium rounded-md px-4 py-3 flex items-center justify-center transition-colors w-full"
                      >
                        Je m'inscris maintenant
                      </a>
                    )}
                    
                    {event.location?.googleMapsUrl && (
                      <a 
                        href={event.location.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 border border-border hover:bg-muted text-foreground font-medium rounded-md px-4 py-3 flex items-center justify-center transition-colors w-full"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Itinéraire
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Registration Section */}
              {event.registrationEnabled && (
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm" id="inscription">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-bold text-primary">Inscription à l'événement</h2>
                  </div>
                  
                  <div className="p-6">
                    {!registrationOpen ? (
                      <div className="bg-muted p-4 rounded-md my-2">
                        <p className="text-muted-foreground">
                          {event.registrationDeadline && new Date() > new Date(event.registrationDeadline)
                            ? "La date limite d'inscription est passée."
                            : "Les inscriptions sont actuellement fermées."}
                        </p>
                      </div>
                    ) : (
                      <>
                        {event.registrationDeadline && (
                          <div className="mb-5 p-3 border border-border rounded-md bg-amber-50/50">
                            <p className="text-sm font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                              <span className="text-amber-800">
                                Date limite d'inscription: {formatDateTime(event.registrationDeadline)}
                              </span>
                            </p>
                          </div>
                        )}
                        
                        {event.registrationForm ? (
                          <EventRegistrationForm 
                            formId={event.registrationForm.id}
                            eventId={event.id}
                            eventTitle={event.title}
                          />
                        ) : (
                          <div className="bg-muted p-4 rounded-md">
                            <p className="text-muted-foreground">
                              Aucun formulaire d'inscription n'est configuré pour cet événement.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}