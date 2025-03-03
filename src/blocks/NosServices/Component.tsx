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
    <div id="services" className="w-full bg-[#26483B] relative section-spacing">
      <WaveDivider fillColor="#26483B" position="top" height={70} className="-mt-16" />
      
      <div className="container mx-auto px-4 relative z-10 content-spacing">
        <div className="text-center max-w-3xl mx-auto relative content-spacing-small">
          <p className="text-xs font-medium uppercase tracking-wider text-[#F0F3F7] mb-2">Nos Valeurs</p>
          <h2 className="text-[#F0F3F7] mb-2 mt-0 text-balance">{heading}</h2>
          {subheading && (
            <p className=" text-balance text-[#F0F3F7]">{subheading}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-10">
          {services?.map((service) => (
            <Card key={service.id} className="bg-[#EDEBE0] rounded-b-xl rounded-t-[60px]">
              <CardHeader className='p-0'>
                <CardTitle className='text-center'>
                  <h3 className='text-2xl font-light'>
                    {service.title}
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent className='w-full mx-auto flex items-center justify-center'>
                <div className="w-full flex items-center justify-center">
                  <Media 
                    resource={service.image} 
                    className="h-full w-auto object-contain p-4" 
                  />
                </div>
              </CardContent>
              <CardFooter className='p-0'>
                <p className="text-gray-600 text-center text-sm px-4 md:px-10">{service.description}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}