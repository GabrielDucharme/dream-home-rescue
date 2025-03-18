import React from 'react'

import { PartnerLogosCarousel } from './PartnerLogosCarousel.client'
import type { PartnerLogosBlock as PartnerLogosBlockProps } from '@/payload-types'

export const PartnerLogosBlock: React.FC<PartnerLogosBlockProps> = ({ 
  heading, 
  description,
  partners 
}) => {
  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        )}
      </div>
      <PartnerLogosCarousel partners={partners} />
    </div>
  )
}