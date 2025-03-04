import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { Dog } from '@/payload-types'
import AdoptMeButton from '@/components/AdoptMeButton'

// Define the page props
type DogDetailPageProps = {
  params: {
    slug: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: DogDetailPageProps): Promise<Metadata> {
  const dog = await getDogBySlug(params.slug)
  
  if (!dog) {
    return {
      title: 'Chien non trouvé | Dream Home Rescue',
      description: 'Nous n\'avons pas pu trouver le chien que vous cherchez',
    }
  }

  return {
    title: `${dog.name} | Dream Home Rescue`,
    description: dog.metaDescription || `${dog.name} est disponible pour l'adoption chez Dream Home Rescue`,
    openGraph: {
      images: dog.mainImage?.url ? [dog.mainImage.url] : [],
    },
  }
}

// Get the dog data from the database
async function getDogBySlug(slug: string): Promise<Dog | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const { docs } = await payload.find({
      collection: 'dogs',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    return docs[0] || null
  } catch (error) {
    console.error('Error fetching dog:', error)
    return null
  }
}

// Main page component
export default async function DogDetailPage({ params }: DogDetailPageProps) {
  // Get the dog data
  const dog = await getDogBySlug(params.slug)
  
  // If no dog is found, return 404
  if (!dog) {
    notFound()
  }
  
  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {dog.mainImage && (
              <div className="w-full md:w-1/2">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={dog.mainImage.url} 
                    alt={dog.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
            <div className="flex-1">
              <div className="bg-flame text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-3">
                {dog.status || 'Disponible à l\'adoption'}
              </div>
              <h1 className="text-4xl font-serif font-bold mb-4">{dog.name}</h1>
              {dog.breed && <p className="text-muted-foreground mb-2">{dog.breed}</p>}
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-6">
                {dog.age && (
                  <div>
                    <span className="font-medium block">Âge</span>
                    <span>{dog.age}</span>
                  </div>
                )}
                {dog.sex && (
                  <div>
                    <span className="font-medium block">Sexe</span>
                    <span>{dog.sex === 'male' ? 'Mâle' : 'Femelle'}</span>
                  </div>
                )}
                {dog.size && (
                  <div>
                    <span className="font-medium block">Taille</span>
                    <span>{dog.size}</span>
                  </div>
                )}
                {dog.weight && (
                  <div>
                    <span className="font-medium block">Poids</span>
                    <span>{dog.weight} kg</span>
                  </div>
                )}
              </div>
              
              <AdoptMeButton dog={dog} className="mt-4" />
            </div>
          </div>
          
          {dog.description && (
            <div className="prose max-w-none mb-12">
              <h2>À propos de {dog.name}</h2>
              <RichText data={dog.description} />
            </div>
          )}
          
          {dog.needs && (
            <div className="prose max-w-none mb-12">
              <h2>Besoins spécifiques</h2>
              <RichText data={dog.needs} />
            </div>
          )}
          
          {dog.goodWith && dog.goodWith.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-4">S'entend bien avec</h2>
              <div className="flex flex-wrap gap-2">
                {dog.goodWith.map((item) => (
                  <span key={item} className="bg-secondary px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-muted p-6 rounded-xl">
            <h2 className="text-2xl font-serif font-bold mb-4">Intéressé(e) par l'adoption?</h2>
            <p className="mb-4">Si vous êtes intéressé(e) par l'adoption de {dog.name}, veuillez remplir notre formulaire d'adoption. Nous vous contacterons dans les plus brefs délais pour discuter de la suite du processus.</p>
            <AdoptMeButton dog={dog} size="lg" />
          </div>
        </div>
      </div>
    </div>
  )
}