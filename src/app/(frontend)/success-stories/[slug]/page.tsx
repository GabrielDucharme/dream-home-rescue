import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import { getDocument } from '@/utilities/getDocument'
import { generateMeta } from '@/utilities/generateMeta'
import { formatDateTime } from '@/utilities/formatDateTime'
import { Button } from '@/components/ui/button'
import { PawIcon, DogHouseIcon } from '@/components/icons'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'

import type { SuccessStory } from '@/payload-types'

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
      {/* Hero section */}
      <div className="relative w-full aspect-video lg:aspect-[21/9] overflow-hidden">
        {successStory.mainImage && (
          <Media
            resource={successStory.mainImage}
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <h1 className="text-3xl md:text-5xl font-fraunces font-bold mb-2">{successStory.title}</h1>
          <p className="text-lg md:text-xl mb-4">
            <span className="inline-flex items-center">
              <PawIcon className="mr-2" width={20} height={20} fill="white" />
              {successStory.dog?.name} - Adopté par {successStory.family}
            </span>
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-white font-medium">
                Date d'adoption: {formatDateTime({
                  date: new Date(successStory.adoptionDate),
                  options: {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                })}
              </p>
            </div>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Link href={`/dogs/${successStory.dog?.slug}`} className="flex items-center gap-2">
                <DogHouseIcon width={16} height={16} />
                Voir le profil de {successStory.dog?.name}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Testimonial if available */}
            {successStory.testimonial && (
              <div className="mb-8 p-6 bg-[#EDEBE0] rounded-lg">
                <blockquote className="text-xl italic">
                  "{successStory.testimonial}"
                </blockquote>
                <p className="mt-4 font-medium">— {successStory.family}</p>
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
                <Button asChild variant="outline">
                  <Link href="/dogs?status=available" className="flex items-center gap-2">
                    <DogHouseIcon width={16} height={16} />
                    Chiens disponibles pour l'adoption
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