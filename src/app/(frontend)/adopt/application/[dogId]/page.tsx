import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import RichText from '@/components/RichText'
import { Dog } from '@/payload-types'
import { FormBlockWrapper } from './FormBlockWrapper.client'
import { AdoptApplicationClient } from './AdoptApplicationClient'

// Define the page props
type AdoptionApplicationPageProps = {
  params: Promise<{
    dogId: string
  }> | {
    dogId: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params: paramsPromise }: AdoptionApplicationPageProps): Promise<Metadata> {
  // Await params if it's a promise
  const params = 'then' in paramsPromise ? await paramsPromise : paramsPromise
  const dogId = params.dogId
  
  const dog = await getDogById(dogId)
  
  if (!dog) {
    return {
      title: "Demande d'adoption | Dream Home Rescue",
      description: "Formulaire de demande d'adoption pour un animal de compagnie",
    }
  }

  return {
    title: `Adopter ${dog.name} | Dream Home Rescue`,
    description: `Formulaire de demande d'adoption pour ${dog.name} chez Dream Home Rescue`,
    openGraph: {
      images: dog.mainImage?.url ? [dog.mainImage.url] : [],
    },
  }
}

// Get the dog data from the database
async function getDogById(dogId: string): Promise<Dog | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const { docs } = await payload.find({
      collection: 'dogs',
      where: {
        id: {
          equals: dogId,
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

// Get adoption form by slug or ID
async function getAdoptionForm() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // First try to get the form by ID directly
    try {
      // Use different form IDs based on environment
      const formId = process.env.NODE_ENV === 'production' 
        ? '67c7382f52221499fc180b45'  // Production form ID
        : '67c72586f855d44d70291478'  // Development form ID
        
      const formById = await payload.findByID({
        collection: 'forms',
        id: formId,
      })
      
      if (formById) {
        return formById
      }
    } catch (idError) {
      // Fall through to try other methods
    }
    
    // Check if the form with the specific slug exists
    const formWithSlug = await payload.find({
      collection: 'forms',
      where: {
        slug: {
          equals: 'formulaire-adoption',
        },
      },
      limit: 1,
    })
    
    if (formWithSlug.docs && formWithSlug.docs.length > 0) {
      return formWithSlug.docs[0]
    }
    
    // If not found with that slug, try to find any form that might contain adoption in the title
    const allForms = await payload.find({
      collection: 'forms',
      limit: 10,
    })
    
    // Try to find a form with "adoption" in the title
    const adoptionForm = allForms.docs.find(form => 
      (form.title && form.title.toLowerCase().includes('adoption'))
    )
    
    if (adoptionForm) {
      return adoptionForm
    }
    
    // If no adoption form is found, just return the first form as a fallback
    if (allForms.docs.length > 0) {
      return allForms.docs[0]
    }
    return null
  } catch (error) {
    console.error('Error fetching adoption form:', error)
    return null
  }
}

// Main page component
export default async function AdoptionApplicationPage({ params: paramsPromise }: AdoptionApplicationPageProps) {
  // Await params if it's a promise
  const params = 'then' in paramsPromise ? await paramsPromise : paramsPromise
  const dogId = params.dogId
  
  // Get the dog and form data
  const dog = await getDogById(dogId)
  const adoptionForm = await getAdoptionForm()
  
  // If no dog is found, return 404
  if (!dog) {
    notFound()
  }
  
  // If no form is found, show an error message
  if (!adoptionForm) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Formulaire non disponible</h1>
        <p className="text-lg">
          Le formulaire d'adoption n'est pas disponible actuellement. 
          Veuillez nous contacter directement par telephone ou email.
        </p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center bg-background/50 border border-border p-6 rounded-xl mb-8">
            {dog.mainImage && (
              <div className="w-full md:w-1/3">
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
                {dog.status || "Disponible a l'adoption"}
              </div>
              <h2 className="text-3xl font-serif font-bold mb-2">{dog.name}</h2>
              {dog.breed && <p className="text-muted-foreground mb-2">{dog.breed}</p>}
              <p className="mb-2">
                <span className="font-medium">Age:</span>{' '}
                {dog.age 
                  ? (typeof dog.age === 'object' 
                    ? `${dog.age.years || 0} an${dog.age.years !== 1 ? 's' : ''} ${dog.age.months ? `et ${dog.age.months} mois` : ''}`
                    : dog.age)
                  : 'Non spécifié'
                }
              </p>
              {dog.sex && <p className="mb-2"><span className="font-medium">Sexe:</span> {dog.sex}</p>}
              {dog.description && (
                <div className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                  <RichText data={dog.description} />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {adoptionForm ? (
          <div className="max-w-6xl mx-auto">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Left sidebar with dog info and tips */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
                <div className="bg-background/80 p-6 rounded-lg border border-border mb-6">
                  <h3 className="text-xl font-serif font-medium mb-4 text-primary">Processus d'adoption</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="bg-flame text-white h-7 w-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</div>
                      <div>
                        <p className="font-medium">Remplir le formulaire</p>
                        <p className="text-sm text-muted-foreground">Complétez toutes les informations demandées</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-flame text-white h-7 w-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</div>
                      <div>
                        <p className="font-medium">Analyse de votre demande</p>
                        <p className="text-sm text-muted-foreground">Nous étudions votre candidature sous 72h</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-flame text-white h-7 w-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</div>
                      <div>
                        <p className="font-medium">Visite préadoption</p>
                        <p className="text-sm text-muted-foreground">Nous organisons une visite à votre domicile</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-flame text-white h-7 w-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">4</div>
                      <div>
                        <p className="font-medium">Finalisation de l'adoption</p>
                        <p className="text-sm text-muted-foreground">Signature du contrat et rencontre avec {dog.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <AdoptApplicationClient dogId={dogId} dogName={dog.name} />
              </div>
              
              {/* Right content with the form */}
              <div className="lg:col-span-8 mt-8 lg:mt-0">
                <div className="bg-white p-8 rounded-lg border border-border shadow-sm">
                  <h2 className="text-2xl font-serif font-bold mb-6 text-center lg:text-left">
                    Formulaire d'adoption pour {dog.name}
                  </h2>
                  <div className="prose prose-sm mb-6 max-w-none">
                    <p>
                      Merci pour votre intérêt à adopter {dog.name}. Ce formulaire nous aide à comprendre votre situation et à 
                      déterminer si {dog.name} correspond à votre mode de vie. Prenez votre temps pour répondre avec 
                      précision à toutes les questions.
                    </p>
                  </div>
                  <FormBlockWrapper form={adoptionForm} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <h3 className="text-lg font-bold mb-2">Formulaire d'adoption non trouvé</h3>
            <p className="mb-4">Le formulaire d'adoption n'a pas été trouvé dans la base de données.</p>
            
            <div className="bg-white p-4 rounded border border-red-100 text-sm font-mono overflow-x-auto">
              <p>Pour corriger ce problème :</p>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Accédez à l'admin Payload</li>
                <li>Allez à la collection "Forms"</li>
                <li>Créez un nouveau formulaire ou modifiez un existant</li>
                <li>Assurez-vous que le slug est exactement "formulaire-adoption"</li>
                <li>Ajoutez tous les champs nécessaires pour le formulaire d'adoption</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}