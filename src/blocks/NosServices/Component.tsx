'use client'

import React from 'react'
import { getDocumentSlug } from '@/utilities/getDocument'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Media } from '@/components/Media'
import { WaveDivider } from '@/components/Divider'

export const Component: React.FC<{
  heading: string
  subheading?: string
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
}> = ({ heading, subheading, services }) => {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <Card key={service.id} className="bg-white h-full flex flex-col">
              <CardHeader>
                <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                  <Media resource={service.image} fill className="object-cover" />
                </div>
                <CardTitle className="mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}