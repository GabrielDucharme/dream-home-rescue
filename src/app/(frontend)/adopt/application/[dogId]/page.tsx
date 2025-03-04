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

// Get adoption form by slug
async function getAdoptionForm() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const { docs } = await payload.find({
      collection: 'forms',
      where: {
        slug: {
          equals: 'formulaire-adoption',
        },
      },
      limit: 1,
    })

    return docs[0] || null
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
        
        {adoptionForm && (
          <div className="max-w-4xl mx-auto">
            <AdoptApplicationClient dogId={params.dogId} dogName={dog.name} />
            
            {/* Wrapped form in a client component for better UX */}
            <div className="mt-4 bg-background/50 p-6 rounded-lg border border-border">
              <FormBlock 
                form={adoptionForm}
                enableIntro={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}