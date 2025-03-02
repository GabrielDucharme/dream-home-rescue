'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { WaveDivider } from '@/components/Divider'
import { formatDateTime } from '@/utilities/formatDateTime'

interface SuccessStory {
  id: string
  title: string
  slug: string
  adoptionDate: string
  family: string
  story: any
  testimonial?: string
  mainImage: {
    url: string
    alt: string
  }
  dog: {
    name: string
    slug: string
  }
}

export const Component: React.FC<{
  heading?: string
  limit?: number
  ctaText?: string
  displayLink?: boolean
  linkText?: string
  linkUrl?: string
}> = ({ 
  heading = 'Nos réussites d\'adoption récentes', 
  limit = 6, 
  ctaText = 'Découvrir l\'histoire',
  displayLink = true, 
  linkText = 'Voir toutes nos histoires',
  linkUrl = '/success-stories'
}) => {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        // Use Payload's REST API directly in the client component
        const response = await fetch(`/api/success-stories?limit=${limit}&sort=-adoptionDate&depth=1`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch success stories');
        }
        
        const data = await response.json();
        setSuccessStories(data.docs || []);
      } catch (error) {
        console.error('Error fetching success stories:', error);
        // For now, use dummy data if API fails
        setSuccessStories([
          {
            id: '1',
            title: 'L\'histoire de Max',
            slug: 'max',
            adoptionDate: new Date().toISOString(),
            family: 'Famille Dubois',
            story: {},
            testimonial: 'Max est un ajout merveilleux à notre famille!',
            mainImage: {
              url: '/media/most-beautiful-dog-breeds-300x169.jpg',
              alt: 'Max'
            },
            dog: {
              name: 'Max',
              slug: 'max'
            }
          },
          {
            id: '2',
            title: 'L\'histoire de Bella',
            slug: 'bella',
            adoptionDate: new Date().toISOString(),
            family: 'Famille Martin',
            story: {},
            mainImage: {
              url: '/media/c952118d-52be-482f-b04b-662a71c1b70b-300x400.jpg',
              alt: 'Bella'
            },
            dog: {
              name: 'Bella',
              slug: 'bella'
            }
          },
          {
            id: '3',
            title: 'L\'histoire de Charlie',
            slug: 'charlie',
            adoptionDate: new Date().toISOString(),
            family: 'Famille Bernard',
            story: {},
            testimonial: 'Charlie est le chien le plus affectueux que nous ayons jamais eu!',
            mainImage: {
              url: '/media/fb3735b7-b739-4094-a333-45a6fa84e9c4-300x384.jpg',
              alt: 'Charlie'
            },
            dog: {
              name: 'Charlie',
              slug: 'charlie'
            }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuccessStories();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="w-full mt-16 mb-28 pt-16 pb-4 relative" style={{ background: 'linear-gradient(180deg, #CDE9CE 0%, rgba(236, 224, 206, 0) 100%)' }}>
        <WaveDivider fillColor="#CDE9CE" position="top" height={70} className="-mt-16" />
        <div className="container">
          <h2 className="text-2xl font-semibold mb-6">{heading}</h2>
          <div className="text-center p-6 bg-card rounded-lg border border-border">
            <p>Chargement des histoires d'adoption...</p>
          </div>
        </div>
      </div>
    );
  }

  if (successStories.length === 0) {
    return (
      <div className="w-full mt-16 mb-28 pt-16 pb-4 relative" style={{ background: 'linear-gradient(180deg, #CDE9CE 0%, rgba(236, 224, 206, 0) 100%)' }}>
        <WaveDivider fillColor="#CDE9CE" position="top" height={70} className="-mt-16" />
        
        <div className="container">
          <h2 className="text-2xl font-semibold mb-6">{heading}</h2>
          <div className="text-center p-6 bg-card rounded-lg border border-border">
            <p>Aucune histoire d'adoption récente n'est disponible.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="adoptions" className="w-full mt-16 mb-28 pt-16 pb-4 relative" style={{ background: 'linear-gradient(180deg, #CDE9CE 0%, rgba(236, 224, 206, 0) 100%)' }}>
      <WaveDivider fillColor="#CDE9CE" position="top" height={70} className="-mt-16" />
      
      <div className="container">
        <h2 className="text-2xl font-semibold mb-8 text-center">{heading}</h2>
      
      <div className="relative px-12">
        <Carousel className="w-full">
          <CarouselContent>
            {successStories.map((story) => (
              <CarouselItem key={story.id} className="basis-full md:basis-1/2 lg:basis-1/3 p-2">
                <div className="relative overflow-hidden rounded-lg shadow-md group">
                  {/* Image with 16:9 aspect ratio */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img 
                      src={story.mainImage?.url} 
                      alt={story.mainImage?.alt || story.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay gradient for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{story.dog?.name}</h3>
                        <p className="text-sm line-clamp-1">
                          {story.testimonial ? 
                            `"${story.testimonial.substring(0, 60)}${story.testimonial.length > 60 ? '...' : '"'}` : 
                            `Adopté par ${story.family} le ${formatDateTime({
                              date: new Date(story.adoptionDate),
                              options: {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            })}`
                          }
                        </p>
                      </div>
                      
                      <Button 
                        size="sm" 
                        asChild
                        className="ml-2 whitespace-nowrap"
                      >
                        <Link href={`/success-stories/${story.slug}`}>
                          {ctaText}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </div>
      
      {displayLink && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" asChild>
            <Link href={linkUrl}>
              {linkText}
            </Link>
          </Button>
        </div>
      )}
      </div>
    </div>
  )
}