"use client"

import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { TestimonialsBlock } from '@/payload-types'

export const TestimonialsCarousel: React.FC<{
  testimonials: TestimonialsBlock['testimonials']
}> = ({ testimonials }) => {
  return (
    <Carousel className="w-full max-w-4xl mx-auto">
      <CarouselContent>
        {testimonials?.map((testimonial, index) => (
          <CarouselItem key={index}>
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              {testimonial.image && (
                <div className="w-24 h-24 mb-6 rounded-full overflow-hidden">
                  <Media 
                    resource={testimonial.image} 
                    imgClassName="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="text-xl md:text-2xl mb-6">
                {testimonial.quote && (
                  <RichText 
                    data={testimonial.quote} 
                    className="text-lg md:text-xl lg:text-2xl italic font-medium" 
                  />
                )}
              </div>
              <div className="mt-4">
                <h4 className="font-bold text-lg">{testimonial.author}</h4>
                {testimonial.role && (
                  <p className="text-muted-foreground">{testimonial.role}</p>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-2 mt-8">
        <CarouselPrevious className="relative static translate-y-0 left-0" />
        <CarouselNext className="relative static translate-y-0 right-0" />
      </div>
    </Carousel>
  )
}