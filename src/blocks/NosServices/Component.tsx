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
    <div id="services" className="w-full bg-[#26483B] pt-0 pb-24 relative mb-16">
      <WaveDivider fillColor="#26483B" position="top" height={70} className="-mt-16" />
      
      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">{heading}</h2>
          {subheading && (
            <p className="text-lg text-white/80">{subheading}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <Card key={service.id} className="bg-[#EDEBE0] h-full flex flex-col max-w-xs mx-auto rounded-b-xl rounded-t-3xl overflow-hidden">
              <CardHeader className="px-6 pt-8 pb-4">
                <CardTitle className="text-center mb-6">{service.title}</CardTitle>
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg mx-auto">
                  <Media resource={service.image} fill className="object-cover" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow px-6 pb-4 pt-6">
                <p className="text-gray-600 text-center">{service.description}</p>
              </CardContent>
              <CardFooter className="px-6 pb-8 pt-2 flex justify-center">
                <Link href={`/services/${service.slug}`}>
                  <Button variant="link" className="text-[#26483B] hover:text-[#1a3229] font-medium underline-offset-4 transition-colors">
                    {buttonLabel}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}