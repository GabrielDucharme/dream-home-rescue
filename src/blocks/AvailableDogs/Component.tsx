import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cn } from '@/utilities/ui'

import type { AvailableDogsBlock } from '@/payload-types'

export const AvailableDogsBlock: React.FC<AvailableDogsBlock> = async (props) => {
  const { title, showStatus = 'available', limit = 6, displayLink = true, linkText = 'Voir tous nos chiens' } = props

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
    },
  }
  
  // Filter by status if not showing all
  if (showStatus !== 'all') {
    query.where = {
      status: {
        equals: showStatus,
      },
    }
  }
  
  const dogsResponse = await payload.find({
    collection: 'dogs',
    ...query,
  })
  
  const { docs: dogs } = dogsResponse

  const statusBadge = (status: string) => {
    const statusMap = {
      available: { text: 'Disponible', classes: 'bg-green-100 text-green-800' },
      pending: { text: 'En cours', classes: 'bg-yellow-100 text-yellow-800' },
      adopted: { text: 'Adopté', classes: 'bg-gray-100 text-gray-800' },
      foster: { text: 'Accueil', classes: 'bg-blue-100 text-blue-800' },
      medical: { text: 'Médical', classes: 'bg-red-100 text-red-800' },
    };
    
    const { text, classes } = statusMap[status] || statusMap.available;
    
    return (
      <span className={`${classes} text-xs font-medium px-2 py-1 rounded-full`}>
        {text}
      </span>
    );
  };

  if (!dogs || dogs.length === 0) {
    return (
      <div className="container mt-12 mb-28">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="text-center p-6 bg-card rounded-lg border border-border">
          <p>Aucun chien n'est disponible pour le moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-12 mb-28">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {dogs.map((dog) => (
          <Link
            key={dog.slug}
            href={`/dogs/${dog.slug}`}
            className="block overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow rounded-t-3xl rounded-b-lg"
          >
            {dog.mainImage && typeof dog.mainImage !== 'string' && (
              <div className="relative aspect-square w-full overflow-hidden">
                <img 
                  src={`${dog.mainImage.url}?w=300&h=300&fit=crop`} 
                  alt={dog.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2">
                  {statusBadge(dog.status)}
                </div>
              </div>
            )}
            <div className="p-3">
              <h3 className="font-bold text-sm">{dog.name}</h3>
              <p className="text-xs text-gray-600 truncate">
                {dog.breed} • {dog.sex === 'male' ? 'Mâle' : 'Femelle'}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {displayLink && (
        <div className="flex justify-center">
          <Button asChild variant="flame" className="font-medium">
            <Link href="/dogs">
              {linkText}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}