'use client'

import React, { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type AdoptApplicationClientProps = {
  dogId: string
  dogName: string
}

export const AdoptApplicationClient: React.FC<AdoptApplicationClientProps> = ({ 
  dogId, 
  dogName 
}) => {
  const [formProgress, setFormProgress] = useState(0)
  const [showTips, setShowTips] = useState(true)
  const router = useRouter()
  
  // Simulated form progress tracking - in a real app, this would be based on fields completed
  useEffect(() => {
    const handleFormChange = () => {
      // This is a simplified example - in a real implementation, you'd calculate based on completed fields
      const form = document.querySelector('form')
      if (form) {
        const inputs = form.querySelectorAll('input, textarea, select')
        let filledCount = 0
        
        inputs.forEach(input => {
          if ((input as HTMLInputElement).value) {
            filledCount++
          }
        })
        
        const newProgress = inputs.length > 0 ? Math.round((filledCount / inputs.length) * 100) : 0
        setFormProgress(newProgress)
      }
    }
    
    // Set up the event listener
    document.addEventListener('change', handleFormChange)
    
    return () => {
      document.removeEventListener('change', handleFormChange)
    }
  }, [])
  
  return (
    <>
      {showTips && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800 font-medium text-lg mb-2">
            Conseils pour remplir votre demande
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            <ul className="list-disc pl-5 space-y-1">
              <li>Prenez votre temps pour compléter le formulaire avec précision</li>
              <li>Répondez à toutes les questions obligatoires (marquées d'un *)</li>
              <li>Si vous avez des questions, contactez-nous au 01 23 45 67 89</li>
              <li>N'oubliez pas de joindre les documents demandés</li>
              <li>Votre demande sera examinée sous 72h par notre équipe</li>
            </ul>
            <Button 
              variant="outline" 
              className="mt-3 text-blue-800 border-blue-300 hover:bg-blue-100"
              onClick={() => setShowTips(false)}
            >
              Masquer ces conseils
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-background/80 p-4 rounded-lg border border-border mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progression du formulaire</span>
          <span className="text-sm font-medium">{formProgress}%</span>
        </div>
        <Progress value={formProgress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          Remplissez tous les champs obligatoires pour compléter votre demande.
        </p>
      </div>
      
      <div className="flex gap-4 mb-6">
        <Button 
          variant="outline"
          onClick={() => router.back()}
          className="text-sm"
        >
          Retour au profil de {dogName}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm ml-auto"
        >
          Haut de page
        </Button>
      </div>
    </>
  )
}