import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Media } from '@/components/Media'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function DogsPage() {
  const payload = await getPayload({ config: configPromise })

  const dogsResponse = await payload.find({
    collection: 'dogs',
    depth: 1,
    limit: 100,
    sort: '-createdAt',
    // Include id for the AdoptMeButton
    select: {
      id: true,
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
          <p>Découvrez tous les chiens disponibles pour l&apos;adoption dans notre refuge.</p>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dogs.map((dog) => (
            <div 
              key={dog.id || `dog-${dog.slug}`}
              className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="relative">
                {dog.mainImage && typeof dog.mainImage !== 'string' && (
                  <div className="relative aspect-video overflow-hidden">
                    <Media 
                      resource={dog.mainImage}
                      alt={dog.name}
                      imgClassName="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      fill
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
                       dog.status === 'foster' ? 'Famille d&apos;accueil' : 
                       dog.status === 'medical' ? 'Soins médicaux' : 
                       'Adopté'}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow">
                <h2 className="text-lg font-bold">{dog.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{dog.breed} - {dog.sex === 'male' ? 'Mâle' : 'Femelle'}</p>
                
                {dog.age && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Âge:</span>{' '}
                    {typeof dog.age === 'object' 
                      ? `${dog.age.years || 0} an${dog.age.years !== 1 ? 's' : ''} ${dog.age.months ? `et ${dog.age.months} mois` : ''}`
                      : dog.age}
                  </p>
                )}
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <Link 
                  href={dog.slug ? `/dogs/${dog.slug}` : `/dogs/${dog.id}`}
                  className="flex justify-center items-center px-3 py-2 bg-primary/10 text-primary text-sm font-medium rounded-md hover:bg-primary/20 transition-colors"
                >
                  Voir profil
                </Link>
                
                {(dog.status === 'available' || dog.status === 'disponible') ? (
                  <Link 
                    href={dog.id ? `/adopt/application/${dog.id}` : '#'}
                    className={`flex justify-center items-center px-3 py-2 bg-flame text-white text-sm font-medium rounded-md hover:bg-flame/90 transition-colors ${!dog.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    {...(!dog.id ? { onClick: (e) => e.preventDefault() } : {})}
                  >
                    Adopter {dog.name}
                  </Link>
                ) : (
                  <div className="flex justify-center items-center px-3 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed">
                    Non disponible
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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