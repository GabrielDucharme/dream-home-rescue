'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [donationType, setDonationType] = useState<'onetime' | 'monthly'>('onetime')
  const [amount, setAmount] = useState<string>('25')
  
  const amounts = ['10', '25', '50', '100', 'Autre']

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] pt-20 flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex flex-col md:flex-row items-center md:items-end justify-between">
        {/* Left Column with Heading */}
        <div className="w-full md:max-w-[45%] mb-8 md:mb-0 text-center md:text-left bg-black/30 p-4 md:p-6 rounded-lg backdrop-blur-sm">
          {richText && <RichText className="mb-4 md:mb-6 [&>h1]:text-2xl sm:[&>h1]:text-3xl md:[&>h1]:text-4xl lg:[&>h1]:text-5xl [&>h1]:font-bold [&>h1]:mb-2 md:[&>h1]:mb-4" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex justify-center md:justify-start gap-2 md:gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        
        {/* Right Column with Donation Card */}
        <div className="w-full md:max-w-[45%]">
          <Card className="w-full bg-white text-gray-800 rounded-xl md:rounded-t-3xl shadow-md md:shadow-none">
            <CardHeader>
              <CardTitle className="text-center text-primary">Faire un don</CardTitle>
              <CardDescription className="text-center">Votre don aide à sauver des chiens dans le besoin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-center gap-4 mb-4">
                  <Button 
                    variant={donationType === 'onetime' ? 'default' : 'outline'} 
                    className="w-full"
                    onClick={() => setDonationType('onetime')}
                  >
                    Unique
                  </Button>
                  <Button 
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
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <Input placeholder="Nom complet" />
                <Input type="email" placeholder="Adresse courriel" />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button className="w-full font-medium" variant="flame" size="lg">
                {donationType === 'onetime' ? 'Faire un don maintenant' : 'Commencer un don mensuel'}
              </Button>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-xs text-muted-foreground">
                  J'accepte les conditions et la politique de confidentialité
                </label>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="min-h-[85vh] md:min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}