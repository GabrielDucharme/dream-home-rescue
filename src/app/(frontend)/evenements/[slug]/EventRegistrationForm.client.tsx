'use client'

import React from 'react'
import { FormBlock } from '@/blocks/Form/Component'
import { useEffect, useState } from 'react'
import { getClientSideURL } from '@/utilities/getURL'
import { FileText, AlertTriangle } from 'lucide-react'

// Import shadcn components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
      <div className="space-y-6">
        <Skeleton className="w-full h-12 rounded-md" />
        <Skeleton className="w-full h-20 rounded-md" />
        <div className="space-y-4">
          <Skeleton className="w-full h-12 rounded-md" />
          <Skeleton className="w-full h-12 rounded-md" />
          <Skeleton className="w-full h-12 rounded-md" />
        </div>
        <Skeleton className="w-32 h-10 rounded-md" />
      </div>
    )
  }
  
  if (error || !form) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription>
          {error || "Le formulaire d'inscription n'est pas disponible pour le moment. Veuillez réessayer plus tard."}
        </AlertDescription>
      </Alert>
    )
  }
  
  // Event metadata to include with the form submission
  const eventMetadata = {
    eventId,
    eventTitle
  }
  
  return (
    <div>
      <Alert className="mb-6 bg-primary/5 border-primary/20">
        <FileText className="h-4 w-4" />
        <AlertTitle>Formulaire d'inscription</AlertTitle>
        <AlertDescription>
          Veuillez remplir le formulaire ci-dessous pour vous inscrire à l'événement. 
          Les champs marqués d'un astérisque (*) sont obligatoires.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardContent className="pt-6">
          <FormBlock 
            form={form}
            enableIntro={false}
            metadata={eventMetadata}
          />
        </CardContent>
      </Card>
    </div>
  )
}