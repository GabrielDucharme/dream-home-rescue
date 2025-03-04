'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dog } from '@/payload-types'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

type AdoptMeButtonProps = {
  dog: Dog
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'flame'
}

export const AdoptMeButton: React.FC<AdoptMeButtonProps> = ({
  dog,
  className = '',
  size = 'default',
  variant = 'flame'
}) => {
  const router = useRouter()
  
  // Only show adopt button if dog is available
  if (dog.status && dog.status.toLowerCase() !== 'disponible' && dog.status.toLowerCase() !== 'available') {
    return null
  }
  
  const handleAdoptClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/adopt/application/${dog.id}`)
  }

  return (
    <Button
      className={`font-medium group ${className}`}
      size={size}
      variant={variant}
      onClick={handleAdoptClick}
    >
      <Heart className="w-4 h-4 mr-2 group-hover:animate-pulse" />
      Adopter {dog.name}
    </Button>
  )
}

export default AdoptMeButton