import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { Dog } from '@/payload-types'
import AdoptMeButton from '@/components/AdoptMeButton'
import { Users, Dog as DogIcon, Cat, Check, X, HelpCircle } from 'lucide-react'

// Generate static pages for all dogs at build time
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const dogs = await payload.find({
      collection: 'dogs',
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    const params = dogs.docs
      .filter(dog => dog && typeof dog.slug === 'string' && dog.slug.length > 0)
      .map(({ slug }) => {
        return { slug }
      })

    return params
  } catch (error) {
    console.error('Error generating static params for dogs:', error)
    return [] // Return empty array to prevent build failures
  }
}

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

// Get the dog data from the database - supports both slug and ID
async function getDogBySlug(slugOrId: string): Promise<Dog | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // First try to find by slug
    const { docs: slugResults } = await payload.find({
      collection: 'dogs',
      where: {
        slug: {
          equals: slugOrId,
        },
      },
      limit: 1,
    })
    
    if (slugResults.length > 0) {
      return slugResults[0]
    }
    
    // If not found by slug, try to find by ID
    try {
      const dogById = await payload.findByID({
        collection: 'dogs',
        id: slugOrId,
      })
      
      if (dogById) {
        return dogById
      }
    } catch (idError) {
      // ID lookup failed, that's okay, we'll return null below
    }

    return null
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
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Hero section with image and basic info */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row">
              {dog.mainImage && (
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={dog.mainImage.url} 
                      alt={dog.name} 
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40"></div>
                  </div>
                </div>
              )}
              <div className="flex-1 p-6 md:p-8 flex flex-col">
                <div className="mb-auto">
                  <div className="bg-flame text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-3">
                    {dog.status || 'Disponible à l\'adoption'}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{dog.name}</h1>
                  {dog.breed && <p className="text-lg text-muted-foreground mb-6">{dog.breed}</p>}
                  
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-4 mb-8 text-sm md:text-base">
                    {dog.age && (
                      <div className="flex items-start gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-primary">Âge</span>
                        </div>
                        <div className="mt-1">
                          {typeof dog.age === 'object' 
                            ? `${dog.age.years || 0} an${dog.age.years !== 1 ? 's' : ''} ${dog.age.months ? `et ${dog.age.months} mois` : ''}`
                            : dog.age}
                        </div>
                      </div>
                    )}
                    {dog.sex && (
                      <div className="flex items-start gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-primary">Sexe</span>
                        </div>
                        <div className="mt-1">{dog.sex === 'male' ? 'Mâle' : 'Femelle'}</div>
                      </div>
                    )}
                    {dog.size && (
                      <div className="flex items-start gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-primary">Taille</span>
                        </div>
                        <div className="mt-1">{dog.size}</div>
                      </div>
                    )}
                    {dog.weight && (
                      <div className="flex items-start gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-primary">Poids</span>
                        </div>
                        <div className="mt-1">{dog.weight} kg</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <AdoptMeButton dog={dog} className="w-full md:w-auto" size="lg" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description card */}
              {dog.description && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-serif font-bold mb-4 text-primary">À propos de {dog.name}</h2>
                  <div className="prose prose-lg max-w-none">
                    <RichText data={dog.description} />
                  </div>
                </div>
              )}
              
              {/* Special needs card */}
              {dog.needs && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-serif font-bold mb-4 text-primary">Besoins spécifiques</h2>
                  <div className="prose prose-lg max-w-none">
                    <RichText data={dog.needs} />
                  </div>
                </div>
              )}
          
              {/* Compatibility card */}
              {dog.goodWith && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-serif font-bold mb-4 text-primary">Compatibilité</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dog.goodWith.kids && (
                      <div className="bg-white p-4 border border-muted rounded-lg shadow-sm hover:border-flame hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-5 h-5 text-flame" />
                          <h3 className="font-medium">Enfants</h3>
                        </div>
                        <div className={`px-3 py-2 rounded-full text-sm inline-flex items-center gap-2 ${
                          dog.goodWith.kids === 'yes' ? 'bg-green-100 text-green-800' : 
                          dog.goodWith.kids === 'no' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {dog.goodWith.kids === 'yes' ? (
                            <>
                              <Check className="w-4 h-4" />
                              Compatible
                            </>
                          ) : dog.goodWith.kids === 'no' ? (
                            <>
                              <X className="w-4 h-4" />
                              Non recommandé
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-4 h-4" />
                              Information non disponible
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {dog.goodWith.dogs && (
                      <div className="bg-white p-4 border border-muted rounded-lg shadow-sm hover:border-flame hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <DogIcon className="w-5 h-5 text-flame" />
                          <h3 className="font-medium">Autres chiens</h3>
                        </div>
                        <div className={`px-3 py-2 rounded-full text-sm inline-flex items-center gap-2 ${
                          dog.goodWith.dogs === 'yes' ? 'bg-green-100 text-green-800' : 
                          dog.goodWith.dogs === 'no' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {dog.goodWith.dogs === 'yes' ? (
                            <>
                              <Check className="w-4 h-4" />
                              Compatible
                            </>
                          ) : dog.goodWith.dogs === 'no' ? (
                            <>
                              <X className="w-4 h-4" />
                              Non recommandé
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-4 h-4" />
                              Information non disponible
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {dog.goodWith.cats && (
                      <div className="bg-white p-4 border border-muted rounded-lg shadow-sm hover:border-flame hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          <Cat className="w-5 h-5 text-flame" />
                          <h3 className="font-medium">Chats</h3>
                        </div>
                        <div className={`px-3 py-2 rounded-full text-sm inline-flex items-center gap-2 ${
                          dog.goodWith.cats === 'yes' ? 'bg-green-100 text-green-800' : 
                          dog.goodWith.cats === 'no' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {dog.goodWith.cats === 'yes' ? (
                            <>
                              <Check className="w-4 h-4" />
                              Compatible
                            </>
                          ) : dog.goodWith.cats === 'no' ? (
                            <>
                              <X className="w-4 h-4" />
                              Non recommandé
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-4 h-4" />
                              Information non disponible
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Photo gallery */}
              {dog.galleryImages && dog.galleryImages.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-serif font-bold mb-4 text-primary">Photos de {dog.name}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {dog.galleryImages.map((item, index) => (
                      <div key={`gallery-${index}`} className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                        {item.image && typeof item.image !== 'string' && (
                          <img 
                            src={item.image.url} 
                            alt={`${dog.name} - photo ${index + 1}`} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 sticky top-24">
                <h2 className="text-2xl font-serif font-bold mb-4 text-primary">Intéressé(e) par {dog.name}?</h2>
                <p className="mb-6 text-gray-600">
                  Si vous êtes intéressé(e) par l'adoption de {dog.name}, veuillez remplir notre formulaire d'adoption. Nous vous contacterons dans les plus brefs délais pour discuter de la suite du processus.
                </p>
                <AdoptMeButton dog={dog} size="lg" className="w-full mb-4" />
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-3">Processus d'adoption</h3>
                  <ol className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-flame text-white flex items-center justify-center text-xs font-bold">1</div>
                      <span>Remplir le formulaire d'adoption en ligne</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-flame text-white flex items-center justify-center text-xs font-bold">2</div>
                      <span>Entretien téléphonique avec un de nos bénévoles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-flame text-white flex items-center justify-center text-xs font-bold">3</div>
                      <span>Visite à votre domicile pour s'assurer de la compatibilité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-flame text-white flex items-center justify-center text-xs font-bold">4</div>
                      <span>Signature du contrat d'adoption et finalisation</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}