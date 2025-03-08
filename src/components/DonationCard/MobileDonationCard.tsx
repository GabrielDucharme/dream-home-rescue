'use client'
import React, { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

type DonationMetadata = {
  sponsorType?: string
  dogId?: string
  dogName?: string
  [key: string]: any
}

type MobileDonationCardProps = {
  className?: string
  isOpen: boolean
  onClose: () => void
  initialAmount?: string
  metadata?: DonationMetadata
}

export const MobileDonationCard: React.FC<MobileDonationCardProps> = ({ 
  className = '', 
  isOpen,
  onClose,
  initialAmount = '25',
  metadata = {}
}) => {
  const router = useRouter()
  const [donationType, setDonationType] = useState<'onetime' | 'monthly'>('onetime')
  const [amount, setAmount] = useState<string>(initialAmount)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [step, setStep] = useState<number>(1)
  
  // Update amount when initialAmount prop changes
  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);
  
  const amounts = ['10', '25', '50', '100', 'Autre']

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (amount === 'Autre' && (!customAmount || isNaN(Number(customAmount)))) {
        setError('Veuillez entrer un montant valide')
        return
      }
      setStep(2)
      setError('')
      return
    }
    
    // Validation for step 2
    if (!name.trim()) {
      setError('Veuillez entrer votre nom')
      return
    }
    
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez entrer une adresse courriel valide')
      return
    }
    
    if (!acceptTerms) {
      setError('Veuillez accepter les conditions')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    const finalAmount = amount === 'Autre' ? customAmount : amount
    
    // Create donation in Payload CMS
    try {
      const donation = {
        donorName: name,
        email: email,
        amount: parseInt(finalAmount),
        donationType: donationType,
        acceptTerms: acceptTerms,
        ...metadata,  // Include any additional metadata like dog info
      }
      
      // Send donation to Payload API
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(donation),
        cache: 'no-store',
      })
      
      if (!response.ok) {
        // Try to get the error message from the response
        try {
          const errorData = await response.json();
          console.error('Donation API error details:', errorData);
          throw new Error(errorData.error || 'Error creating donation');
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
          throw new Error(`Error creating donation. Status: ${response.status}`);
        }
      }
      
      const result = await response.json()
      
      // If Stripe checkout URL is returned, redirect to it
      if (result.checkoutUrl) {
        router.push(result.checkoutUrl)
      } else {
        // Handle non-Stripe success case (unlikely in production)
        console.log('Donation submitted successfully:', result)
      }
    } catch (error) {
      console.error('Error submitting donation:', error)
      setError('Une erreur est survenue lors de l\'envoi de votre don. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="w-full max-w-md animate-slide-up">
        <Card className={`w-full bg-white text-gray-800 rounded-t-xl shadow-lg ${className}`}>
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-2 relative">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-center text-primary text-xl">
                {step === 1 ? 'Faire un don' : 'Vos informations'}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 1 ? 'Votre don aide à sauver des chiens dans le besoin' : 'Presque terminé!'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="flex justify-center gap-4 mb-4">
                    <Button 
                      type="button"
                      variant={donationType === 'onetime' ? 'default' : 'outline'} 
                      className="w-full h-12 text-base"
                      onClick={() => setDonationType('onetime')}
                    >
                      Unique
                    </Button>
                    <Button 
                      type="button"
                      variant={donationType === 'monthly' ? 'default' : 'outline'} 
                      className="w-full h-12 text-base"
                      onClick={() => setDonationType('monthly')}
                    >
                      Mensuel
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {amounts.map((amt) => (
                      <Button 
                        key={amt}
                        type="button"
                        variant={amount === amt ? 'default' : 'outline'} 
                        className="w-full h-14 text-base"
                        onClick={() => setAmount(amt)}
                      >
                        {amt === 'Autre' ? amt : `${amt}$`}
                      </Button>
                    ))}
                  </div>
                  
                  {amount === 'Autre' && (
                    <div className="mt-2">
                      <Input
                        type="number"
                        min="1"
                        placeholder="Montant personnalisé"
                        className="w-full h-12 text-base"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        required={amount === 'Autre'}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mobile-name" className="text-base">Nom complet</Label>
                    <Input 
                      id="mobile-name"
                      placeholder="Nom complet" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile-email" className="text-base">Adresse courriel</Label>
                    <Input 
                      id="mobile-email"
                      type="email" 
                      placeholder="Adresse courriel" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id="mobile-terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                      required
                      className="h-5 w-5"
                    />
                    <label htmlFor="mobile-terms" className="text-sm text-muted-foreground">
                      J'accepte les conditions et la politique de confidentialité
                    </label>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-2 bg-red-50 text-red-500 text-sm rounded">
                  {error}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-4 pb-6 pt-2">
              <Button 
                type="submit" 
                className="w-full font-medium h-14 text-base" 
                variant="flame" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Traitement en cours...' : 
                  step === 1 
                    ? 'Continuer' 
                    : donationType === 'onetime' 
                      ? 'Faire un don maintenant' 
                      : 'Commencer un don mensuel'}
              </Button>

              {step === 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm"
                  onClick={() => setStep(1)}
                >
                  Retour
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}