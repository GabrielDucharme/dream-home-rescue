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
import { Media } from '@/components/Media'

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
        <h2 className="mb-8 text-center">{heading}</h2>
      
      <div className="relative px-4 md:px-14">
        <Carousel className="w-full" opts={{ loop: successStories.length > 1 }}>
          <CarouselContent className={`py-4 ${successStories.length === 1 ? 'justify-center' : ''}`}>
            {successStories.map((story) => (
              <CarouselItem 
                key={story.id} 
                className={`basis-full ${successStories.length > 1 ? 'md:basis-1/2' : 'md:basis-2/3 lg:basis-1/2'} p-4`}>
                <div className="relative overflow-hidden rounded-xl shadow-lg group hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-gradient-to-br from-primary/5 to-primary/10">
                  {/* Image container with overlay elements */}
                  <div className="relative w-full h-80 overflow-hidden">
                    {/* Blurred background image */}
                    <div className="absolute inset-0 opacity-30 blur-xl scale-110 overflow-hidden">
                      <Media
                        resource={story.mainImage}
                        alt=""
                        imgClassName="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Main image */}
                    <div className="absolute inset-0 flex items-center justify-center z-1">
                      <Media
                        resource={story.mainImage}
                        alt={story.mainImage?.alt || story.title}
                        imgClassName="max-w-full max-h-80 object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Dark gradient overlay at the top */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
                    
                    {/* Date on image */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                        {formatDateTime({
                          date: new Date(story.adoptionDate),
                          options: {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        })}
                      </div>
                    </div>
                    
                    {/* Badge */}
                    <div className="absolute top-3 right-3 z-20 bg-primary shadow-md text-white text-xs px-3 py-1 rounded-full font-medium">
                      Adopté
                    </div>
                    
                    {/* Dog name overlay at bottom of image */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10 pt-12 pb-4 px-4">
                      <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">{story.dog?.name}</h3>
                      <p className="text-xs text-white/90">
                        Adopté par {story.family}
                      </p>
                    </div>
                  </div>
                  
                  {/* Minimal, clean card footer */}
                  <div className="p-4 flex-grow flex flex-col bg-white">
                    {story.testimonial && (
                      <p className="text-sm italic text-gray-600 mb-4 line-clamp-2">
                        "{story.testimonial.substring(0, 100)}{story.testimonial.length > 100 ? '...' : '"'}
                      </p>
                    )}
                    
                    <div className="mt-auto">
                      <Button 
                        size="sm"
                        variant="default"
                        asChild
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
          {successStories.length > 1 && (
            <>
              <CarouselPrevious className="-left-4 md:-left-10 size-9 md:size-10 bg-white shadow-md text-primary hover:bg-primary hover:text-white" />
              <CarouselNext className="-right-4 md:-right-10 size-9 md:size-10 bg-white shadow-md text-primary hover:bg-primary hover:text-white" />
            </>
          )}
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