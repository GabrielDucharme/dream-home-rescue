'use client'

import React from 'react'
import AdoptMeButton from '@/components/AdoptMeButton'
import { Dog } from '@/payload-types'

type AdoptMeButtonClientProps = {
  dog: Dog
  className?: string
}

export default function AdoptMeButtonClient({ dog, className }: AdoptMeButtonClientProps) {
  // Click handler to stop event propagation
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  
  // Make sure the dog is available for adoption
  if (dog.status && dog.status.toLowerCase() !== 'available' && dog.status.toLowerCase() !== 'disponible') {
    return (
      <div 
        className={`text-center text-sm text-muted-foreground ${className}`}
        onClick={handleButtonClick}
      >
        {dog.status === 'pending' ? 'Adoption en cours' : 
         dog.status === 'foster' ? 'En famille d\'accueil' : 
         dog.status === 'medical' ? 'En soins médicaux' : 
         'Non disponible à l\'adoption'}
      </div>
    )
  }
  
  return (
    <div onClick={handleButtonClick}>
      <AdoptMeButton dog={dog} className={className} />
    </div>
  )
}