import React from 'react'

import { TestimonialsCarousel } from './TestimonialsCarousel.client'
import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ 
  heading, 
  testimonials 
}) => {
  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
      </div>
      <TestimonialsCarousel testimonials={testimonials} />
    </div>
  )
}