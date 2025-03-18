"use client"

import React, { useEffect, useRef } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel'
import { Media } from '@/components/Media'
import { PartnerLogosBlock } from '@/payload-types'
import Link from 'next/link'

export const PartnerLogosCarousel: React.FC<{
  partners: PartnerLogosBlock['partners']
}> = ({ partners }) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Auto-scroll animation
    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current.querySelector('.embla__container')
        if (container) {
          const currentScroll = container.scrollLeft
          const width = container.scrollWidth
          const viewportWidth = carouselRef.current.clientWidth
          
          // If we're at the end, reset to beginning
          if (currentScroll + viewportWidth >= width) {
            container.scrollLeft = 0
          } else {
            // Smooth scroll by a small amount
            container.scrollLeft += 1
          }
        }
      }
    }, 30) // Adjust timing for smoother or faster scroll
    
    return () => clearInterval(scrollInterval)
  }, [])

  if (!partners || partners.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden" ref={carouselRef}>
      <Carousel 
        opts={{
          align: 'start',
          loop: true,
          dragFree: true
        }}
        className="w-full"
      >
        <CarouselContent className="flex">
          {partners?.map((partner, index) => (
            <CarouselItem key={index} className="flex-grow-0 flex-shrink-0 basis-1/4 min-w-[120px] sm:min-w-[160px] md:min-w-[180px]">
              {partner && (
                <Link 
                  href={partner.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 h-24 flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  {partner.logo && (
                    <Media 
                      resource={partner.logo} 
                      priority={index < 4}
                      fill={false}
                      sizes="(max-width: 768px) 120px, 180px"
                      imgClassName="max-h-16 w-auto object-contain"
                    />
                  )}
                </Link>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}