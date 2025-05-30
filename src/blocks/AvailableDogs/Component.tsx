import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cn } from '@/utilities/ui'
import { DogsCarousel } from './DogCarousel'
import Image from 'next/image'

import type { AvailableDogsBlock } from '@/payload-types'
import { Separator } from '@/components/ui/separator'

// Server component to fetch data
const DogsData = async ({
  showStatus = 'available',
  limit = 6,
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
      age: true,
      size: true,
      weight: true,
      goodWith: true,
      adoptionDate: true,
    },
  }

  // Always ensure we're only getting published content
  query.where = {
    and: [
      {
        // Filter by status if not showing all
        ...(showStatus !== 'all'
          ? {
              status: {
                equals: showStatus,
              },
            }
          : {}),
      },
      {
        // Make sure we're not getting draft content
        _status: {
          equals: 'published',
        },
      },
    ],
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
    linkText = 'Voir tous nos chiens',
    backgroundColor = 'bg-[#F9F9F9]',
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
    <div id="carousel" className={`relative pb-24`}>
      <div className="container mb-36">
        {/* Decorative background images */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/twistie.png"
            alt=""
            width={500}
            height={500}
            className="absolute -right-20 bottom-36 select-none w-1/2 md:w-1/3 overflow-hidden"
            aria-hidden="true"
          />
          <Image
            src="/love.png"
            alt=""
            width={280}
            height={280}
            className="absolute left-10 bottom-0 select-none w-1/2 md:w-1/4"
            aria-hidden="true"
          />
        </div>

        <h2 className="md:text-balance text-4xl md:text-5xl font-medium text-center max-w-2xl mx-auto mb-24">
          {title}
        </h2>

        <div className="relative z-10 mb-10">
          <DogsCarousel dogs={dogs} />
        </div>

        {displayLink && (
          <div className="relative z-10 flex justify-center pt-12">
            <Button
              asChild
              withArrow
              size="lg"
              className="font-medium bg-[#051436] text-white md:text-lg"
            >
              <Link href="/dogs" className="text-white">
                {linkText}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
