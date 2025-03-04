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
    <div className="pt-24 pb-24">
      <div className="container mb-8">
        <div className="prose max-w-none">
          <h1>Nos Chiens</h1>
          <p>Découvrez tous les chiens disponibles pour l&apos;adoption dans notre refuge.</p>
        </div>
      </div>

      <div className="container">
        <DogsGrid dogs={dogs} />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Nos Chiens | Dream Home Rescue',
    description: 'Découvrez tous les chiens disponibles pour l&apos;adoption chez Dream Home Rescue.',
  }
}