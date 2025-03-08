'use client'
import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type DonationCardProps = {
  className?: string
}

export const DonationCard: React.FC<DonationCardProps> = ({ className = '' }) => {
  const router = useRouter()
  const [donationType, setDonationType] = useState<'onetime' | 'monthly'>('onetime')
  const [amount, setAmount] = useState<string>('25')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  
  const amounts = ['10', '25', '50', '100', 'Autre']

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validation
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
    
    // Make sure we have a valid amount
    if (amount === 'Autre' && (!customAmount || isNaN(Number(customAmount)))) {
      setError('Veuillez entrer un montant valide')
      return
    }
    
    const finalAmount = amount === 'Autre' ? customAmount : amount
    
    // Create donation in Payload CMS
    try {
      const donation = {
        donorName: name,
        email: email,
        amount: parseInt(finalAmount),
        donationType: donationType,
        acceptTerms: acceptTerms,
      }
      
      // Send donation to Payload API
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donation),
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
        // Redirect to a thank you page or show success message
      }
    } catch (error) {
      console.error('Error submitting donation:', error)
      setError('Une erreur est survenue lors de l\'envoi de votre don. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={`w-full bg-white text-gray-800 rounded-xl md:rounded-t-3xl shadow-md md:shadow-none ${className}`}>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-center text-primary">Faire un don</CardTitle>
          <CardDescription className="text-center">Votre don aide à sauver des chiens dans le besoin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-center gap-4 mb-4">
              <Button 
                type="button"
                variant={donationType === 'onetime' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => setDonationType('onetime')}
              >
                Unique
              </Button>
              <Button 
                type="button"
                variant={donationType === 'monthly' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => setDonationType('monthly')}
              >
                Mensuel
              </Button>
            </div>
            
            <div className="grid grid-cols-5 gap-1 md:gap-2 mb-4">
              {amounts.map((amt) => (
                <Button 
                  key={amt}
                  type="button"
                  variant={amount === amt ? 'default' : 'outline'} 
                  className="w-full text-xs md:text-base px-1 md:px-4"
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
                  className="w-full"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  required={amount === 'Autre'}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input 
                id="name"
                placeholder="Nom complet" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Adresse courriel</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="Adresse courriel" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-2 bg-red-50 text-red-500 text-sm rounded">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full font-medium" 
            variant="flame" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Traitement en cours...' : 
              donationType === 'onetime' ? 'Faire un don maintenant' : 'Commencer un don mensuel'}
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              required
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground">
              J'accepte les conditions et la politique de confidentialité
            </label>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}