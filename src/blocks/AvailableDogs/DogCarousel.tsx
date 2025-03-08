"use client"

import React from 'react'
import Link from 'next/link'
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { ImageMedia } from '@/components/Media/ImageMedia'

export const DogsCarousel = ({ dogs }) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="relative mx-auto w-full"
    >
      <CarouselContent>
        {dogs.map((dog, index) => (
          <CarouselItem key={dog.id || `dog-${index}`} className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 px-2">
            <Link
              href={`/dogs/${dog.slug}`}
              className="block overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow rounded-t-2xl rounded-b-lg h-full"
            >
              {dog.mainImage && typeof dog.mainImage !== 'string' && (
                <div className="relative aspect-square w-full overflow-hidden">
                  <ImageMedia
                    resource={dog.mainImage}
                    alt={dog.name}
                    imgClassName="w-full h-full object-cover"
                    fill
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-sm">{dog.name}</h3>
                <p className="text-xs text-gray-600 truncate">
                  {dog.breed} • {dog.sex === 'male' ? 'Mâle' : 'Femelle'}
                </p>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1" />
      <CarouselNext className="right-1" />
    </Carousel>
  )
}