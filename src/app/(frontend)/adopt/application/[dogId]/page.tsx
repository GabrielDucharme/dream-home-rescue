import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import RichText from '@/components/RichText'
import { Dog } from '@/payload-types'
import { FormBlock } from '@/blocks/Form/Component'
import { AdoptApplicationClient } from './AdoptApplicationClient'

// Define the page props
type AdoptionApplicationPageProps = {
  params: {
    dogId: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: AdoptionApplicationPageProps): Promise<Metadata> {
  const dog = await getDogById(params.dogId)
  
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
      // You mentioned the form ID is 67c72586f855d44d70291478
      const formById = await payload.findByID({
        collection: 'forms',
        id: '67c72586f855d44d70291478',
      })
      
      if (formById) {
        console.log('Found adoption form by ID (67c72586f855d44d70291478):', formById.id)
        return formById
      }
    } catch (idError) {
      console.log('Could not find form by ID, trying other methods...')
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
      console.log('Found adoption form with slug "formulaire-adoption":', formWithSlug.docs[0].id)
      return formWithSlug.docs[0]
    }
    
    // If not found with that slug, try to find any form that might contain adoption in the title
    console.log('No form found with slug "formulaire-adoption", trying to find any adoption form...')
    const allForms = await payload.find({
      collection: 'forms',
      limit: 10,
    })
    
    console.log(`Found ${allForms.totalDocs} forms in total`)
    
    // Log the available forms for debugging
    allForms.docs.forEach(form => {
      console.log(`- Form: "${form.title}" (ID: ${form.id})`)
    })
    
    // Try to find a form with "adoption" in the title
    const adoptionForm = allForms.docs.find(form => 
      (form.title && form.title.toLowerCase().includes('adoption'))
    )
    
    if (adoptionForm) {
      console.log(`Using form "${adoptionForm.title}" instead (ID: ${adoptionForm.id})`)
      return adoptionForm
    }
    
    // If no adoption form is found, just return the first form as a fallback
    if (allForms.docs.length > 0) {
      console.log(`No adoption form found, using first available form "${allForms.docs[0].title}" as fallback`)
      return allForms.docs[0]
    }
    
    console.log('No forms found in the database')
    return null
  } catch (error) {
    console.error('Error fetching adoption form:', error)
    return null
  }
}

// Main page component
export default async function AdoptionApplicationPage({ params }: AdoptionApplicationPageProps) {
  // Get the dog and form data
  const dog = await getDogById(params.dogId)
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

  const introContent = {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: `Vous souhaitez adopter ${dog.name}`,
              type: "text",
              version: 1
            }
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "heading",
          version: 1,
          tag: "h1"
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "Merci de l'interet que vous portez a nos animaux ! Pour adopter un animal chez Dream Home Rescue, nous vous demandons de remplir ce formulaire afin de nous assurer que l'adoption est adaptee aux besoins specifiques de l'animal et a votre mode de vie.",
              type: "text",
              version: 1
            }
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "Le processus d'adoption comprend plusieurs etapes :",
              type: "text",
              version: 1
            }
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1
        },
        {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Remplir ce formulaire d'adoption",
                  type: "text",
                  version: 1
                }
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "listitem",
              version: 1,
              value: 1
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Entretien telephonique avec un de nos benevoles",
                  type: "text",
                  version: 1
                }
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "listitem",
              version: 1,
              value: 2
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Visite a votre domicile",
                  type: "text",
                  version: 1
                }
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "listitem",
              version: 1,
              value: 3
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Signature du contrat d'adoption et finalisation",
                  type: "text",
                  version: 1
                }
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "listitem",
              version: 1,
              value: 4
            }
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "list",
          version: 1,
          listType: "number"
        }
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
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
              {dog.age && <p className="mb-2"><span className="font-medium">Age:</span> {dog.age}</p>}
              {dog.sex && <p className="mb-2"><span className="font-medium">Sexe:</span> {dog.sex}</p>}
              {dog.description && (
                <div className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                  <RichText data={dog.description} />
                </div>
              )}
            </div>
          </div>
          
          <RichText data={introContent} />
        </div>
        
        {adoptionForm ? (
          <div className="max-w-4xl mx-auto">
            <AdoptApplicationClient dogId={params.dogId} dogName={dog.name} />
            
            {/* Form debugging info - remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <p><strong>Form debugging info:</strong></p>
                <p>Form ID: {adoptionForm.id}</p>
                <p>Form Title: {adoptionForm.title}</p>
                <p>Form Slug: {adoptionForm.slug}</p>
                <p>Fields Count: {adoptionForm.fields?.length || 0}</p>
              </div>
            )}
            
            {/* Wrapped form in a client component for better UX */}
            <div className="mt-4 bg-background/50 p-6 rounded-lg border border-border">
              <FormBlock 
                form={adoptionForm}
                enableIntro={false}
              />
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