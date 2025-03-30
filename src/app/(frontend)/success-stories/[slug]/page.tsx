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
    depth: 2, // Increase depth to ensure we get all nested content
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

      {/* Content section with improved background and spacing */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2">
              {/* Testimonial if available - subtle design */}
              {successStory.testimonial && (
                <div className="mb-6 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                  <div className="p-6 md:p-8">
                    <blockquote className="text-gray-600 italic text-lg">
                      "{successStory.testimonial}"
                    </blockquote>
                    <p className="mt-4 text-sm text-gray-500 text-right">
                      — {successStory.family}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Main story content with improved UI */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-8 md:p-10">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    L'histoire de {successStory.dog?.name}
                  </h2>
                  
                  {successStory.story ? (
                    <div className="prose prose-lg prose-headings:text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none prose-img:rounded-lg prose-img:shadow-md prose-p:leading-relaxed">
                      <RichText content={successStory.story} />
                    </div>
                  ) : (
                    <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                      <p className="text-amber-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Le contenu de cette histoire n'est pas disponible. Veuillez vérifier le contenu dans l'interface d'administration.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Gallery images with improved UI */}
              {successStory.galleryImages && successStory.galleryImages.length > 0 && (
                <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="p-6 md:p-6">
                    <h3 className="text-xl font-bold mb-5 text-primary border-b pb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Photos du bonheur
                    </h3>
                    <div className="grid grid-cols-2 gap-5">
                      {successStory.galleryImages.map((item, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300 bg-gray-50">
                          <div className="relative w-full h-0" style={{ paddingBottom: '66.67%' }}> {/* 3:2 aspect ratio container */}
                            <Media
                              resource={item.image}
                              fill
                              priority={i < 2}
                              className="object-cover transition-all duration-500 group-hover:scale-105"
                              imgClassName="filter brightness-[1.02]"
                            />
                          </div>
                          {item.caption && (
                            <div className="p-3 text-sm text-gray-700 italic bg-white border-t border-gray-100">{item.caption}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Back to all stories */}
              <div className="sticky top-24 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-6 md:p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary border-b pb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Voir plus
                  </h3>
                  <div className="flex flex-col gap-4">
                    <Button asChild className="w-full">
                      <Link href="/success-stories" className="flex items-center justify-center gap-2 w-full">
                        <PawIcon width={16} height={16} fill="white" />
                        Toutes nos histoires d'adoption
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dogs?status=available" className="flex items-center justify-center gap-2 w-full">
                        <PawIcon width={16} height={16} fill="#051436" />
                        Chiens à adopter
                      </Link>
                    </Button>
                  </div>
                </div>
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