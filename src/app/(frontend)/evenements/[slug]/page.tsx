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

// Import shadcn components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

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
              {/* Event type label with Badge component */}
              <Badge variant="default" className="bg-flame mb-3 md:mb-5 px-3 py-1.5 text-xs md:text-sm">
                Événement de financement
              </Badge>
              
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
                  <Button
                    variant="flame"
                    size="lg"
                    className="w-full md:w-auto shadow-md hover:shadow-lg"
                    asChild
                  >
                    <a href="#inscription">Je m'inscris maintenant</a>
                  </Button>
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
            {/* Description section */}
            <Card className="mb-12 border-border/30">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-primary relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-primary/30 after:rounded-full">
                  À propos de l'événement
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <RichText data={event.description} />
              </CardContent>
            </Card>
            
            {/* Ticket options */}
            {hasTicketOptions && (
              <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-primary/20 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 z-0"></div>
                <div className="relative z-10 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-serif font-bold text-primary">Options de participation</h2>
                    {registrationOpen && (
                      <Button
                        variant="outline" 
                        size="sm"
                        className="bg-white/80 backdrop-blur-sm shadow-sm text-primary rounded-full"
                        asChild
                        withArrow
                      >
                        <a href="#inscription">Voir l'inscription</a>
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    {event.ticketOptions.map((ticket: any, i: number) => (
                      <HoverCard key={i}>
                        <HoverCardTrigger asChild>
                          <Card 
                            className={`overflow-hidden flex flex-col h-full group hover:shadow-md transition-all cursor-pointer ${
                              i === 0 ? 'border-2 border-primary/40 ring-2 ring-primary/10' : 'border-border/30'
                            }`}
                          >
                            {i === 0 && (
                              <div className="bg-primary text-white text-xs font-medium py-1.5 px-3 text-center">
                                Option recommandée
                              </div>
                            )}
                            
                            <CardContent className="p-6 sm:p-8 flex-grow pt-6">
                              <div className="flex flex-col mb-5">
                                <span className={`text-3xl font-bold mb-2 ${i === 0 ? 'text-primary' : ''}`}>
                                  {ticket.price ? `${ticket.price} $` : 'Gratuit'}
                                </span>
                                <h3 className="text-xl font-bold">{ticket.name}</h3>
                              </div>
                              
                              {ticket.description && (
                                <CardDescription className={`mb-4 flex-grow ${i === 0 ? 'text-foreground' : ''}`}>
                                  {ticket.description}
                                </CardDescription>
                              )}
                            </CardContent>
                            
                            <CardFooter className="p-6 border-t border-border/40 mt-auto bg-gray-50/80 block">
                              {ticket.maxQuantity && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                                  <Users className="h-4 w-4" />
                                  <span>Limité à {ticket.maxQuantity} participations</span>
                                </div>
                              )}
                              
                              {registrationOpen ? (
                                <Button
                                  variant={i === 0 ? "flame" : "outline"}
                                  className={`w-full ${i === 0 ? 'shadow-md hover:shadow-lg' : ''}`}
                                  asChild
                                >
                                  <a href="#inscription">
                                    {i === 0 ? 'Choisir cette option' : 'Sélectionner'}
                                  </a>
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="w-full bg-muted text-muted-foreground cursor-not-allowed"
                                  disabled
                                >
                                  Non disponible
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">{ticket.name}</h4>
                            <p className="text-sm text-muted-foreground">{ticket.description}</p>
                            <Separator className="my-2" />
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Prix:</span>
                              <span className="font-bold">{ticket.price ? `${ticket.price} $` : 'Gratuit'}</span>
                            </div>
                            {ticket.maxQuantity && (
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Disponibilité:</span>
                                <span>{ticket.maxQuantity} places</span>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground pt-2">
                              Cliquez sur la carte pour sélectionner cette option et vous inscrire à l'événement.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Sponsors */}
            {hasSponsors && (
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>Nos commanditaires</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Platinum sponsors */}
                  {event.sponsors.filter((s: any) => s.sponsorLevel === 'platinum').length > 0 && (
                    <div className="mb-10">
                      <Badge className="bg-primary mb-6 px-3 py-1">Commanditaires Platine</Badge>
                      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                        {event.sponsors
                          .filter((s: any) => s.sponsorLevel === 'platinum')
                          .map((sponsor: any, i: number) => (
                            <Card key={i} className="flex flex-col items-center text-center overflow-hidden">
                              <CardContent className="pt-6">
                                {sponsor.logo ? (
                                  <div className="mb-4 h-28 w-full relative">
                                    <Media 
                                      resource={sponsor.logo}
                                      imgClassName="object-contain"
                                      alt={sponsor.name}
                                      fill
                                    />
                                  </div>
                                ) : (
                                  <div className="mb-4 font-bold text-xl">{sponsor.name}</div>
                                )}
                              </CardContent>
                              
                              {sponsor.website && (
                                <CardFooter className="pt-0">
                                  <Button variant="outline" size="sm" asChild>
                                    <a 
                                      href={sponsor.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      Visiter le site <ExternalLink className="h-3 w-3 ml-2" />
                                    </a>
                                  </Button>
                                </CardFooter>
                              )}
                            </Card>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Gold sponsors */}
                  {event.sponsors.filter((s: any) => s.sponsorLevel === 'gold').length > 0 && (
                    <div className="mb-10">
                      <Badge variant="outline" className="mb-6 px-3 py-1 border-amber-300 bg-amber-50 text-amber-700">
                        Commanditaires Or
                      </Badge>
                      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
                        {event.sponsors
                          .filter((s: any) => s.sponsorLevel === 'gold')
                          .map((sponsor: any, i: number) => (
                            <Card key={i} className="flex flex-col items-center text-center overflow-hidden">
                              <CardContent className="pt-6">
                                {sponsor.logo ? (
                                  <div className="mb-3 h-16 w-full relative">
                                    <Media 
                                      resource={sponsor.logo}
                                      imgClassName="object-contain"
                                      alt={sponsor.name}
                                      fill
                                    />
                                  </div>
                                ) : (
                                  <div className="mb-3 font-bold">{sponsor.name}</div>
                                )}
                              </CardContent>
                              
                              {sponsor.website && (
                                <CardFooter className="pt-0">
                                  <Button variant="outline" size="sm" asChild>
                                    <a 
                                      href={sponsor.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      Site web <ExternalLink className="h-3 w-3 ml-2" />
                                    </a>
                                  </Button>
                                </CardFooter>
                              )}
                            </Card>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Other sponsors */}
                  {event.sponsors.filter((s: any) => !['platinum', 'gold'].includes(s.sponsorLevel || '')).length > 0 && (
                    <div>
                      <Badge variant="outline" className="mb-6 px-3 py-1">
                        Autres commanditaires
                      </Badge>
                      <Card>
                        <CardContent className="grid gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
                          {event.sponsors
                            .filter((s: any) => !['platinum', 'gold'].includes(s.sponsorLevel || ''))
                            .map((sponsor: any, i: number) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                <span className="font-medium">{sponsor.name}</span>
                                {sponsor.sponsorLevel && (
                                  <Badge variant="outline" className="ml-auto">
                                    {sponsor.sponsorLevel === 'silver' ? 'Argent' : 
                                      sponsor.sponsorLevel === 'bronze' ? 'Bronze' : 'Soutien'}
                                  </Badge>
                                )}
                              </div>
                            ))
                          }
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* FAQ */}
            {hasFAQ && (
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-primary relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-primary/30 after:rounded-full">
                    Questions fréquentes
                  </CardTitle>
                  <CardDescription>
                    Tout ce que vous devez savoir sur l'événement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {event.faq.map((item: any, i: number) => (
                      <Accordion key={i} type="single" collapsible className="w-full">
                        <AccordionItem value={`item-${i}`}>
                          <AccordionTrigger className="text-left font-medium px-4 hover:no-underline">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 prose-sm max-w-none">
                            <RichText data={item.answer} />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Gallery */}
            {hasGallery && (
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>Galerie photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {event.galleryImages.map((item: any, i: number) => (
                      <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-all">
                        <Media 
                          resource={item.image}
                          fill
                          imgClassName="object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={item.caption || `Image ${i+1}`}
                        />
                        {item.caption && (
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2 text-white text-xs font-medium translate-y-full group-hover:translate-y-0 transition-transform">
                            {item.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              {/* Event Details Card */}
              <Card className="mb-7">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle>Détails de l'événement</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-6 space-y-6 divide-y">
                  {/* Date details */}
                  <div className="pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-2">Date et heure</h3>
                        <p className="font-medium">{eventDateFormatted}</p>
                        <p className="text-muted-foreground">{eventTimeStr}</p>
                        {endDateStr && (
                          <Badge variant="outline" className="mt-2">
                            <Calendar className="h-3 w-3 mr-1" />
                            Jusqu'au {endDateStr}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Location details */}
                  <div className="py-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-2">Emplacement</h3>
                        <p className="font-medium">{event.location?.name}</p>
                        <p className="text-muted-foreground">
                          {event.location?.address}<br />
                          {event.location?.city}, {event.location?.postalCode}
                        </p>
                        {event.location?.googleMapsUrl && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3"
                            asChild
                          >
                            <a 
                              href={event.location.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Voir sur Google Maps <ExternalLink className="h-3 w-3 ml-2" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Organizers section */}
                  {event.organizers && event.organizers.length > 0 && (
                    <div className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base mb-2">Organisateurs</h3>
                          <ul className="space-y-4 divide-y divide-border/30">
                            {event.organizers.map((organizer: any, i: number) => (
                              <li key={i} className={i > 0 ? "pt-4" : ""}>
                                <p className="font-medium">{organizer.name}</p>
                                {organizer.role && (
                                  <p className="text-muted-foreground text-sm">{organizer.role}</p>
                                )}
                                {organizer.contact && (
                                  <Button variant="link" size="sm" className="px-0 h-auto" asChild>
                                    <a href={`mailto:${organizer.contact}`}>
                                      {organizer.contact}
                                    </a>
                                  </Button>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col border-t pt-6">
                  {hasTicketOptions && (
                    <div className="flex items-center justify-between w-full mb-4 bg-muted p-3 rounded-lg">
                      <span className="text-muted-foreground">Prix:</span>
                      <span className="font-bold">
                        {event.ticketOptions[0]?.price ? `À partir de ${event.ticketOptions[0].price} $` : 'Gratuit'} $` : 'Gratuit'}
                      </span>
                    </div>
                  )}
                  
                  {registrationOpen && (
                    <Button 
                      variant="flame"
                      size="lg"
                      className="w-full mb-3"
                      asChild
                    >
                      <a href="#inscription">Je m'inscris maintenant</a>
                    </Button>
                  )}
                  
                  {event.location?.googleMapsUrl && (
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a 
                        href={event.location.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Itinéraire
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {/* Registration Section */}
              {event.registrationEnabled && (
                <Card id="inscription">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle>Inscription à l'événement</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    {!registrationOpen ? (
                      <Alert variant="destructive" className="my-2">
                        <AlertTitle>
                          {event.registrationDeadline && new Date() > new Date(event.registrationDeadline)
                            ? "La date limite d'inscription est passée."
                            : "Les inscriptions sont actuellement fermées."}
                        </AlertTitle>
                      </Alert>
                    ) : (
                      <>
                        {event.registrationDeadline && (
                          <Alert className="mb-6 border-amber-200 bg-amber-50/70">
                            <Calendar className="h-4 w-4 text-amber-600" />
                            <AlertTitle className="text-amber-800 ml-2">
                              Date limite d'inscription: <span className="font-bold">{formatDateTime(event.registrationDeadline)}</span>
                            </AlertTitle>
                          </Alert>
                        )}
                        
                        {event.registrationForm ? (
                          <Card>
                            <CardContent className="pt-6">
                              <EventRegistrationForm 
                                formId={event.registrationForm.id}
                                eventId={event.id}
                                eventTitle={event.title}
                              />
                            </CardContent>
                          </Card>
                        ) : (
                          <Alert>
                            <AlertTitle>
                              Aucun formulaire d'inscription n'est configuré pour cet événement.
                            </AlertTitle>
                          </Alert>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
            </div>
          </div>
        </div>
  )
}