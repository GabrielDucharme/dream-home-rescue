'use client'

import React from 'react'
import { getDocumentSlug } from '@/utilities/getDocument'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import { WaveDivider } from '@/components/Divider'
import Link from 'next/link'

export const Component: React.FC<{
  heading: string
  subheading?: string
  buttonLabel?: string
  services: Array<{
    id: string
    title: string
    description: string
    image: {
      id: string
      url: string
      alt: string
    }
    slug: string
  }>
}> = ({ heading, subheading, buttonLabel = 'En savoir plus', services }) => {
  return (
    <div id="services" className="w-full bg-[#26483B] pt-0 relative section-spacing-small">
      <WaveDivider fillColor="#26483B" position="top" height={70} className="-mt-16" />
      
      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="text-center mb-12">
          <h2 className="text-[#F0F3F7] mb-2">{heading}</h2>
          {subheading && (
            <p className="text-lg text-white/80">{subheading}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services?.map((service) => (
            <Card key={service.id} className="bg-[#EDEBE0] rounded-b-xl rounded-t-3xl">
              <CardHeader>
                <CardTitle className='text-center'>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className='p-0 w-full mx-auto flex items-center justify-center'>
                <Media resource={service.image} className="object-cover p-8" />
              </CardContent>
              <CardFooter>
                <p className="text-gray-600 text-center text-sm px-10">{service.description}</p>
              </CardFooter>

            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}