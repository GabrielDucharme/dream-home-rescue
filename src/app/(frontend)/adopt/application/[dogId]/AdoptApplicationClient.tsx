'use client'

import React, { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ChevronLeft, HelpCircle, ArrowUpCircle } from 'lucide-react'

type AdoptApplicationClientProps = {
  dogId: string
  dogName: string
}

export const AdoptApplicationClient: React.FC<AdoptApplicationClientProps> = ({ 
  dogId, 
  dogName 
}) => {
  const [formProgress, setFormProgress] = useState(0)
  const [showTips, setShowTips] = useState(false)
  const router = useRouter()
  
  // Form progress tracking
  useEffect(() => {
    const handleFormChange = () => {
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
    
    // Initial calculation
    setTimeout(handleFormChange, 1000)
    
    // Set up the event listener
    document.addEventListener('change', handleFormChange)
    
    return () => {
      document.removeEventListener('change', handleFormChange)
    }
  }, [])
  
  return (
    <>
      <div className="space-y-6">
        {/* Progress tracker */}
        <div className="bg-background/80 p-5 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm font-medium">{formProgress}%</span>
          </div>
          <Progress value={formProgress} className="h-2 bg-gray-100" />
          <p className="text-xs text-muted-foreground mt-2">
            {formProgress < 50 
              ? "Continuez à remplir les champs obligatoires" 
              : formProgress < 90 
                ? "Vous avancez bien, continuez !" 
                : "Presque terminé !"}
          </p>
        </div>
        
        {/* Tips section - collapsible */}
        <div className="bg-background/80 rounded-lg border border-border overflow-hidden">
          <button 
            className="w-full px-5 py-4 text-left flex items-center justify-between"
            onClick={() => setShowTips(!showTips)}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-flame" />
              <span className="font-medium">Conseils pour remplir le formulaire</span>
            </div>
            <ChevronLeft className={`w-5 h-5 transition-transform ${showTips ? 'rotate-90' : '-rotate-90'}`} />
          </button>
          
          {showTips && (
            <div className="px-5 py-4 border-t border-border">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-flame font-bold">•</span>
                  <span>Prenez votre temps pour compléter le formulaire avec précision</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-flame font-bold">•</span>
                  <span>Répondez à toutes les questions obligatoires (marquées d'un *)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-flame font-bold">•</span>
                  <span>Si vous avez des questions, contactez-nous au 01 23 45 67 89</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-flame font-bold">•</span>
                  <span>N'oubliez pas de joindre les documents demandés si nécessaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-flame font-bold">•</span>
                  <span>Votre demande sera examinée sous 72h par notre équipe</span>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className="space-y-2">
          <Button 
            variant="outline"
            onClick={() => router.back()}
            className="text-sm w-full flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour au profil de {typeof dogName === 'string' ? dogName : 'ce chien'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm w-full flex items-center justify-center gap-1"
          >
            <ArrowUpCircle className="w-4 h-4" />
            Haut de page
          </Button>
        </div>
      </div>
    </>
  )
}