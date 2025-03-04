'use client'

import React from 'react'
import { FormBlock } from '@/blocks/Form/Component'
import { useEffect, useState } from 'react'
import { getClientSideURL } from '@/utilities/getURL'

type EventRegistrationFormProps = {
  formId: string
  eventId: string
  eventTitle: string
}

export function EventRegistrationForm({ formId, eventId, eventTitle }: EventRegistrationFormProps) {
  const [form, setForm] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${getClientSideURL()}/api/forms/${formId}`)
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du formulaire')
        }
        
        const data = await response.json()
        setForm(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching form:', err)
        setError("Impossible de charger le formulaire d'inscription.")
      } finally {
        setIsLoading(false)
      }
    }
    
    if (formId) {
      fetchForm()
    }
  }, [formId])
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (error || !form) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md">
        <p>{error || "Formulaire non disponible"}</p>
      </div>
    )
  }
  
  // Event metadata to include with the form submission
  const eventMetadata = {
    eventId,
    eventTitle
  }
  
  return (
    <div>
      <FormBlock 
        form={form}
        enableIntro={false}
        metadata={eventMetadata}
      />
    </div>
  )
}