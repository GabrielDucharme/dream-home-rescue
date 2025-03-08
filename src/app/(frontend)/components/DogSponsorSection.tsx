'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MobileDonationCard } from '@/components/DonationCard'
import { Dog } from '@/payload-types'
import { PawPrint } from 'lucide-react'

interface DogSponsorSectionProps {
  dog: Dog
}

export const DogSponsorSection: React.FC<DogSponsorSectionProps> = ({ dog }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [sponsorshipAmount, setSponsorshipAmount] = useState<string>('25')

  const handleSponsorClick = (amount: string) => {
    setSponsorshipAmount(amount)
    setIsOpen(true)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-flame/10 p-2 rounded-full">
          <PawPrint className="h-6 w-6 text-flame" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-primary">Parrainer {dog.name}</h2>
      </div>
      
      <p className="mb-6 text-gray-600">
        Vous ne pouvez pas adopter {dog.name} mais souhaitez l'aider? Devenez son parrain/marraine! 
        Votre don nous aide à couvrir ses frais médicaux, sa nourriture et son hébergement.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Button 
          onClick={() => handleSponsorClick('25')}
          variant="outline"
          className="border-flame text-flame hover:bg-flame hover:text-white"
        >
          25$ - Nourriture
        </Button>
        <Button 
          onClick={() => handleSponsorClick('50')}
          variant="outline"
          className="border-flame text-flame hover:bg-flame hover:text-white"
        >
          50$ - Vaccins
        </Button>
        <Button 
          onClick={() => handleSponsorClick('100')}
          variant="outline"
          className="border-flame text-flame hover:bg-flame hover:text-white"
        >
          100$ - Soins complets
        </Button>
      </div>
      
      <Button 
        onClick={() => setIsOpen(true)}
        variant="flame"
        className="w-full"
        size="lg"
      >
        Parrainer {dog.name}
      </Button>
      
      <MobileDonationCard 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        initialAmount={sponsorshipAmount}
        metadata={{
          sponsorType: 'dog',
          dogId: dog.id,
          dogName: dog.name
        }}
      />
    </div>
  )
}