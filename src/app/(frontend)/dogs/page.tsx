import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import DogsGrid from './DogsGrid.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function DogsPage() {
  const payload = await getPayload({ config: configPromise })

  const dogsResponse = await payload.find({
    collection: 'dogs',
    depth: 1,
    limit: 100,
    sort: '-createdAt',
    // Only show dogs that are available for adoption - use explicit filtering to ensure it works in production
    where: {
      and: [
        {
          status: {
            equals: 'available'
          }
        },
        {
          // Make sure we're not getting draft content in production
          _status: {
            equals: 'published'
          }
        }
      ]
    },
    // Include id for the AdoptMeButton and goodWith for filtering
    select: {
      id: true,
      name: true,
      breed: true,
      sex: true,
      status: true,
      mainImage: true,
      slug: true,
      age: true,
      goodWith: true,
    },
  })

  const dogs = dogsResponse.docs || []

  return (
    <div className="pt-20 pb-28 bg-gray-50">
      <div className="container mb-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos Chiens à Adopter</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Découvrez les chiens actuellement disponibles pour l&apos;adoption dans notre refuge. 
            Utilisez les filtres ci-dessous pour trouver votre compagnon idéal.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DogsGrid dogs={dogs} />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Nos Chiens à Adopter | Dream Home Rescue',
    description: 'Découvrez les chiens actuellement disponibles pour l&apos;adoption chez Dream Home Rescue.',
  }
}