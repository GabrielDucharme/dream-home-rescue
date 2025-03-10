import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import { getDocument } from '@/utilities/getDocument'
import { generateMeta } from '@/utilities/generateMeta'
import { formatDateTime } from '@/utilities/formatDateTime'
import { Button } from '@/components/ui/button'
import { PawIcon } from '@/components/icons'
import Link from 'next/link'
import { Media } from '@/components/Media'
import RichText  from '@/components/RichText'

import type { SuccessStory } from '@/payload-types'

// Add custom styles for hero section
const textShadowStyles = {
  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
}

export default async function SuccessStoryPage({ params: { slug } }) {
  const successStory = await getDocument<SuccessStory>({
    collection: 'success-stories',
    slug,
    depth: 1,
  })

  if (!successStory) {
    return notFound()
  }

  return (
    <div>
      {/* Hero section with blurred background */}
      <div className="relative w-full overflow-hidden bg-gray-900 py-24 md:py-28">
        {/* Blurred background image */}
        {successStory.mainImage && (
          <div className="absolute inset-0 w-full h-full">
            <Media
              resource={successStory.mainImage}
              fill
              priority
              imgClassName="object-cover w-full h-full object-center blur-sm opacity-30"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70"></div>
          </div>
        )}
        
        {/* Main content container with fixed width */}
        <div className="relative z-10 container max-w-6xl mx-auto px-4">
          {/* Header content in original layout */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
            {/* Profile image (square) - now larger and visible on mobile too */}
            {successStory.mainImage && (
              <div className="flex-shrink-0">
                <div className="w-48 h-48 md:w-56 md:h-56 xl:w-64 xl:h-64 rounded-lg overflow-hidden border-4 border-white shadow-xl relative">
                  <Media
                    resource={successStory.mainImage}
                    fill
                    imgClassName="object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Header content - better centered vertically with image */}
            <div className="flex-1 flex flex-col justify-center text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white" style={textShadowStyles}>{successStory.title}</h1>
              <p className="text-lg md:text-xl mb-6 text-white" style={textShadowStyles}>
                <span className="inline-flex items-center justify-center md:justify-start">
                  <PawIcon className="mr-2" width={20} height={20} fill="white" />
                  {successStory.dog?.name} - Adopté par {successStory.family}
                </span>
              </p>
              <div className="flex justify-center md:justify-start">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-white font-medium">
                    Date d&apos;adoption: {formatDateTime({
                      date: new Date(successStory.adoptionDate),
                      options: {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="container py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Testimonial if available */}
            {successStory.testimonial && (
              <div className="mb-10 p-8 bg-[#EDEBE0] rounded-xl shadow-sm relative">
                <div className="absolute -top-5 -left-2 text-6xl text-[#d3cfc1]">"</div>
                <blockquote className="text-xl italic relative z-10">
                  {successStory.testimonial}
                </blockquote>
                <p className="mt-6 font-medium text-right">— {successStory.family}</p>
              </div>
            )}
            
            {/* Main story content */}
            <div className="prose prose-lg max-w-none">
              <RichText content={successStory.story} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Gallery images */}
            {successStory.galleryImages && successStory.galleryImages.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-fraunces font-bold mb-4">Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {successStory.galleryImages.map((item, i) => (
                    <div key={i} className="aspect-square relative rounded-lg overflow-hidden">
                      <Media
                        resource={item.image}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
                {successStory.galleryImages[0]?.caption && (
                  <p className="mt-2 text-sm text-gray-600">{successStory.galleryImages[0].caption}</p>
                )}
              </div>
            )}

            {/* Back to all stories */}
            <div className="sticky top-24">
              <h3 className="text-xl font-fraunces font-bold mb-4">Voir plus</h3>
              <div className="flex flex-col gap-4">
                <Button asChild>
                  <Link href="/success-stories" className="flex items-center gap-2">
                    <PawIcon width={16} height={16} fill="white" />
                    Toutes nos histoires d'adoption
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const successStory = await getDocument<SuccessStory>({
    collection: 'success-stories',
    slug,
  })

  return generateMeta({
    title: successStory?.meta?.title || successStory?.title,
    description: successStory?.meta?.description,
    image: successStory?.meta?.image,
  })
}