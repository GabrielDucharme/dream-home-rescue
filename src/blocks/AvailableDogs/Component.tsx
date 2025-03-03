import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cn } from '@/utilities/ui'
import { DogsCarousel } from './DogCarousel'
import Image from 'next/image'

import type { AvailableDogsBlock } from '@/payload-types'

// Server component to fetch data
const DogsData = async ({ 
  showStatus = 'available', 
  limit = 6 
}: { 
  showStatus: string
  limit: number
}) => {
  // Get dogs from Payload
  const payload = await getPayload({ config: configPromise })
  
  const query: any = {
    limit,
    depth: 1,
    sort: '-createdAt',
    select: {
      name: true,
      breed: true,
      sex: true,
      status: true,
      mainImage: true,
      slug: true,
    },
  }
  
  // Filter by status if not showing all
  if (showStatus !== 'all') {
    query.where = {
      status: {
        equals: showStatus,
      },
    }
  }
  
  const dogsResponse = await payload.find({
    collection: 'dogs',
    ...query,
  })
  
  return dogsResponse.docs
}

// This is a server component now (no "use client" directive)
export const AvailableDogsBlock: React.FC<AvailableDogsBlock> = async (props) => {
  const { 
    title, 
    subtitle,
    showStatus = 'available', 
    limit = 6, 
    displayLink = true, 
    linkText = 'Voir tous nos chiens' 
  } = props

  const dogs = await DogsData({ showStatus, limit })

  if (!dogs || dogs.length === 0) {
    return (
      <div className="container">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="text-center p-6 bg-card rounded-lg border border-border">
          <p>Aucun chien n'est disponible pour le moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div id="carousel" className="container relative section-spacing mb-48">
      {/* Decorative background images */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image 
          src="/twistie.png" 
          alt="" 
          width={500} 
          height={500} 
          className="absolute -right-20 -bottom-20 select-none w-1/2 md:w-1/3"
          aria-hidden="true"
        />
        <Image 
          src="/love.png" 
          alt="" 
          width={280} 
          height={280} 
          className="absolute -left-10 -bottom-48 select-none w-1/2 md:w-1/4"
          aria-hidden="true"
        />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center md:text-left md:flex-row md:items-end md:justify-between mb-6 md:mb-20">
        <h2 className="md:max-w-xl md:text-balance mb-0 mt-0">{title}</h2>
        {subtitle && (
          <p className="mt-2 md:mt-0 md:mb-1 max-w-md text-pretty">{subtitle}</p>
        )}
      </div>
      
      <div className="relative z-10 mb-10">
        <DogsCarousel dogs={dogs} />
      </div>
      
      {displayLink && (
        <div className="relative z-10 flex justify-center pt-10">
          <Button asChild withArrow className="font-medium bg-[#051436] text-white md:text-lg">
            <Link href="/dogs" className='text-white'>
              {linkText}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}