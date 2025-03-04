'use client'

import React from 'react'
import { FormBlock } from '@/blocks/Form/Component'

interface FormBlockWrapperProps {
  form: any
  dogId?: string
  dogName?: string
}

export function FormBlockWrapper({ form, dogId, dogName }: FormBlockWrapperProps) {
  if (!form) {
    return <div className="p-6 bg-gray-50 rounded-lg text-center">Aucun formulaire disponible</div>
  }
  
  // Ensure form data is properly structured before rendering
  if (!form.fields || !Array.isArray(form.fields)) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium mb-4">Le formulaire n'a pas de champs définis.</p>
        <p className="text-sm text-gray-600">
          Veuillez configurer le formulaire dans l'interface d'administration en ajoutant des champs.
        </p>
      </div>
    )
  }

  // Dog metadata to include with the form submission
  const dogMetadata = {
    dogId,
    dogName
  }

  return (
    <div className="rounded-lg">
      <FormBlock 
        form={form}
        enableIntro={false}
        metadata={dogMetadata}
      />
    </div>
  )
}