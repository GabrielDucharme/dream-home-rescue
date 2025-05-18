import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import DogsGrid from './DogsGrid.client'
import { Dog as PayloadDog } from '@/payload-types'
import { Dog as ClientDog } from './DogsGrid.client'

export const dynamic = 'force-dynamic'
export const revalidate = 600

// Convert Payload dog type to client-side dog type
function convertToClientDog(dog: PayloadDog): ClientDog {
  return {
    id: dog.id,
    name: dog.name,
    breed: dog.breed || '',
    sex: dog.sex || '',
    status: dog.status || 'available',
    mainImage: dog.mainImage,
    slug: dog.slug || undefined,
    age:
      typeof dog.age === 'string'
        ? dog.age
        : dog.age
          ? {
              years: dog.age.years || 0,
              months: dog.age.months || 0,
            }
          : undefined,
    goodWith: dog.goodWith
      ? {
          kids: dog.goodWith.kids || undefined,
          dogs: dog.goodWith.dogs || undefined,
          cats: dog.goodWith.cats || undefined,
        }
      : undefined,
  }
}

type DogsPageSearchParams = {
  page?: string
  breeds?: string
  sex?: string
  goodWithKids?: 'yes' | 'no' | 'unknown'
  goodWithDogs?: 'yes' | 'no' | 'unknown'
  goodWithCats?: 'yes' | 'no' | 'unknown'
}

export default async function DogsPage({
  searchParams: searchParamsProp,
}: {
  searchParams: DogsPageSearchParams
}) {
  const payload = await getPayload({ config: configPromise })
  const searchParams: DogsPageSearchParams = await searchParamsProp

  // Fetch all unique breeds
  const allDogsForBreeds = await payload.find({
    collection: 'dogs',
    depth: 0, // No need to populate relationships
    limit: 0, // No limit, effectively all dogs with pagination: false
    pagination: false, // Get all documents
    select: {
      breed: true, // Only select the breed field
    },
    where: {
      // Optionally, you might want to filter by status: 'published' here too
      // if you only want breeds from published dogs to appear in filters.
      _status: {
        equals: 'published',
      },
    },
  })

  const uniqueBreeds = [
    ...new Set(
      (allDogsForBreeds.docs || []) // Ensure docs is treated as an array
        .map((dog) => dog.breed)
        .filter((breed): breed is string => typeof breed === 'string' && breed.trim() !== ''),
    ),
  ].sort()

  // Parse page number from query params or default to 1
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1
  const pageSize = 9 // Number of dogs per page

  const whereConditions: any[] = [
    {
      status: {
        equals: 'available',
      },
    },
    {
      _status: {
        equals: 'published',
      },
    },
  ]

  if (searchParams.breeds) {
    const breedArray = searchParams.breeds.split(',').filter((b) => b.trim() !== '')
    if (breedArray.length > 0) {
      whereConditions.push({ breed: { in: breedArray } })
    }
  }

  if (searchParams.sex) {
    const sexArray = searchParams.sex.split(',').filter((s) => s.trim() !== '')
    if (sexArray.length > 0) {
      whereConditions.push({ sex: { in: sexArray } })
    }
  }

  if (searchParams.goodWithKids) {
    whereConditions.push({ 'goodWith.kids': { equals: searchParams.goodWithKids } })
  }
  if (searchParams.goodWithDogs) {
    whereConditions.push({ 'goodWith.dogs': { equals: searchParams.goodWithDogs } })
  }
  if (searchParams.goodWithCats) {
    whereConditions.push({ 'goodWith.cats': { equals: searchParams.goodWithCats } })
  }

  const dogsResponse = await payload.find({
    collection: 'dogs',
    depth: 1,
    limit: pageSize,
    page: currentPage,
    sort: '-createdAt',
    where: {
      and: whereConditions,
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

  // Convert dogs to client-side format
  const dogs = dogsResponse.docs.map(convertToClientDog) || []

  // Extract pagination metadata from the response
  const pagination = {
    totalDocs: dogsResponse.totalDocs || 0,
    limit: dogsResponse.limit || pageSize,
    totalPages: dogsResponse.totalPages || 1,
    page: dogsResponse.page || currentPage,
    hasPrevPage: !!dogsResponse.hasPrevPage,
    hasNextPage: !!dogsResponse.hasNextPage,
    prevPage: dogsResponse.prevPage || null,
    nextPage: dogsResponse.nextPage || null,
  }

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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DogsGrid dogs={dogs} pagination={pagination} allBreeds={uniqueBreeds} />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Nos Chiens à Adopter | Dream Home Rescue',
    description:
      'Découvrez les chiens actuellement disponibles pour l&apos;adoption chez Dream Home Rescue.',
  }
}
