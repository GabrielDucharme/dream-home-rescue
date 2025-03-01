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
  linkText = 'Voir toutes nos adoptions',
  linkUrl = '/dogs'
}) => {
  // In a real implementation, this would come from the API
  // For now, using dummy data to demonstrate the UI
  const [adoptedDogs, setAdoptedDogs] = useState([]);
  
  useEffect(() => {
    // Mock data - in production this would be fetched from payload
    const dogs = [
      {
        id: '1',
        name: 'Max',
        description: 'Un adorable berger allemand qui a trouvé sa famille pour toujours.',
        image: '/media/most-beautiful-dog-breeds-300x169.jpg',
        slug: '/dogs/max'
      },
      {
        id: '2',
        name: 'Bella',
        description: 'Après 6 mois au refuge, Bella a enfin trouvé son foyer parfait.',
        image: '/media/c952118d-52be-482f-b04b-662a71c1b70b-300x400.jpg',
        slug: '/dogs/bella'
      },
      {
        id: '3',
        name: 'Charlie',
        description: 'Charlie adore sa nouvelle famille et ses longues promenades quotidiennes.',
        image: '/media/fb3735b7-b739-4094-a333-45a6fa84e9c4-300x384.jpg',
        slug: '/dogs/charlie'
      },
      {
        id: '4',
        name: 'Luna',
        description: 'Cette adorable husky a trouvé une famille qui l\'aime autant qu\'elle les aime.',
        image: '/media/c1fdf92d-db2b-48d8-8f96-319a4d84974d-300x327.jpg',
        slug: '/dogs/luna'
      },
      {
        id: '5',
        name: 'Rocky',
        description: 'Rocky adore son nouveau jardin et sa famille aimante.',
        image: '/media/istockphoto-1386479313-612x612-300x200.jpg',
        slug: '/dogs/rocky'
      },
      {
        id: '6',
        name: 'Daisy',
        description: 'Daisy est maintenant la princesse de sa nouvelle maison!',
        image: '/media/close-head-shot-portrait-preppy-600nw-1433809418-300x200.webp',
        slug: '/dogs/daisy'
      }
    ];
    
    setAdoptedDogs(dogs.slice(0, limit));
  }, [limit]);

  if (adoptedDogs.length === 0) {
    return (
      <div className="w-full mt-16 mb-28 pt-16 pb-4 relative" style={{ background: 'linear-gradient(180deg, #CDE9CE 0%, rgba(236, 224, 206, 0) 100%)' }}>
        <WaveDivider fillColor="#CDE9CE" position="top" height={70} className="-mt-16" />
        
        <div className="container">
          <h2 className="text-2xl font-semibold mb-6">{heading}</h2>
          <div className="text-center p-6 bg-card rounded-lg border border-border">
            <p>Aucune adoption récente n'est disponible.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-16 mb-28 pt-16 pb-4 relative" style={{ background: 'linear-gradient(180deg, #CDE9CE 0%, rgba(236, 224, 206, 0) 100%)' }}>
      <WaveDivider fillColor="#CDE9CE" position="top" height={70} className="-mt-16" />
      
      <div className="container">
        <h2 className="text-2xl font-semibold mb-8 text-center">{heading}</h2>
      
      <div className="relative px-12">
        <Carousel className="w-full">
          <CarouselContent>
            {adoptedDogs.map((dog) => (
              <CarouselItem key={dog.id} className="basis-full md:basis-1/2 lg:basis-1/3 p-2">
                <div className="relative overflow-hidden rounded-lg shadow-md group">
                  {/* Image with 16:9 aspect ratio */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img 
                      src={dog.image} 
                      alt={dog.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay gradient for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{dog.name}</h3>
                        <p className="text-sm line-clamp-1">{dog.description}</p>
                      </div>
                      
                      <Button 
                        size="sm" 
                        asChild
                        className="ml-2 whitespace-nowrap"
                      >
                        <Link href={dog.slug}>
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