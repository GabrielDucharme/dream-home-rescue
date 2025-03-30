import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

import { getDocument } from '@/utilities/getDocument'
import { generateMeta } from '@/utilities/generateMeta'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import { PawIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import type { SuccessStory } from '@/payload-types'

export const metadata: Metadata = generateMeta({
  title: "Histoires d'Adoption | Dream Home Rescue",
  description:
    'Découvrez les histoires touchantes de nos chiens adoptés et leurs nouvelles familles.',
})

export default async function SuccessStoriesPage() {
  const successStories = await getDocument<{
    docs: SuccessStory[]
    totalDocs: number
  }>({
    collection: 'success-stories',
    query: {
      sort: '-adoptionDate',
      limit: 100,
      depth: 1,
    },
  })

  const stories = successStories?.docs || []

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-fraunces font-bold mb-4">Histoires d'adoption</h1>
        <p className="text-xl max-w-3xl">
          Chaque chien mérite une maison aimante. Voici les histoires touchantes des chiens qui ont
          trouvé leur famille pour toujours grâce à Dream Home Rescue.
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="text-center p-12 bg-[#EDEBE0] rounded-lg">
          <h2 className="text-2xl font-fraunces font-semibold mb-4">
            Aucune histoire disponible pour le moment
          </h2>
          <p className="mb-6">
            Revenez bientôt pour découvrir les histoires touchantes de nos adoptions!
          </p>
          <Button asChild>
            <Link href="/dogs?status=available">Voir les chiens disponibles pour l'adoption</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/success-stories/${story.slug}`}
              className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 card-hover border border-border"
            >
              <div className="relative aspect-square overflow-hidden">
                {story.mainImage && (
                  <Media
                    resource={story.mainImage}
                    fill
                    className="object-cover"
                    imgClassName="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90"></div>

                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h2 className="text-2xl font-fraunces font-bold text-white drop-shadow-sm tracking-tight">
                    {story.dog?.name}
                  </h2>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white mt-0">
                    <PawIcon width={14} height={14} fill="white" className="mr-2" />
                    <span className="text-xs font-medium">
                      {formatDateTime({
                        date: new Date(story.adoptionDate),
                        options: {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        },
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-3 text-primary heading-serif">{story.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {story.testimonial
                    ? `"${story.testimonial.substring(0, 120)}${story.testimonial.length > 120 ? '...' : '"'}`
                    : `${story.dog?.name} a été adopté par ${story.family}`}
                </p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Adopté par {story.family}
                  </span>
                  <span className="text-flame font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Lire l'histoire
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link href="/dogs?status=available" className="flex items-center gap-2">
            <PawIcon width={16} height={16} fill="#051436" />
            Voir les chiens disponibles
          </Link>
        </Button>
      </div>
    </div>
  )
}
