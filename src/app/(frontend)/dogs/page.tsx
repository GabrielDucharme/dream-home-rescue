import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function DogsPage() {
  const payload = await getPayload({ config: configPromise })

  const dogsResponse = await payload.find({
    collection: 'dogs',
    depth: 1,
    limit: 100,
    sort: '-createdAt',
    select: {
      name: true,
      breed: true,
      sex: true,
      status: true,
      mainImage: true,
      slug: true,
    },
  })

  const dogs = dogsResponse.docs || []

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose max-w-none">
          <h1>Nos Chiens</h1>
          <p>Découvrez tous les chiens disponibles pour l'adoption dans notre refuge.</p>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dogs.map((dog) => (
            <a 
              key={dog.slug} 
              href={`/dogs/${dog.slug}`}
              className="block border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
            >
              {dog.mainImage && typeof dog.mainImage !== 'string' && (
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={`${dog.mainImage.url}?w=600&h=400&fit=crop`} 
                    alt={dog.name} 
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${
                      dog.status === 'available' ? 'bg-green-100 text-green-800' : 
                      dog.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      dog.status === 'foster' ? 'bg-blue-100 text-blue-800' : 
                      dog.status === 'medical' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {dog.status === 'available' ? 'Disponible' : 
                     dog.status === 'pending' ? 'Adoption en cours' : 
                     dog.status === 'foster' ? 'Famille d\'accueil' : 
                     dog.status === 'medical' ? 'Soins médicaux' : 
                     'Adopté'}
                  </div>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-bold">{dog.name}</h2>
                <p className="text-sm text-gray-600">{dog.breed} - {dog.sex === 'male' ? 'Mâle' : 'Femelle'}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Nos Chiens | Fondation de Secours pour Chiens',
    description: 'Découvrez tous les chiens disponibles pour l\'adoption dans notre refuge.',
  }
}