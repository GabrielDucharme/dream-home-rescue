'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { X } from 'lucide-react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { DonationCard } from '@/components/DonationCard'
import { Button } from '@/components/ui/button'

// Create a touchable overlay component for mobile 
const TouchableOverlay = ({ onClose }: { onClose: () => void }) => {
  return (
    <div 
      className="fixed inset-0 z-40" 
      onClick={onClose}
      aria-label="Close donation form"
    />
  )
}

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [showMobileDonation, setShowMobileDonation] = React.useState(false)

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] pt-24 md:pt-20 flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 mt-4 md:mt-0 z-10 relative flex flex-col md:flex-row items-center md:items-end justify-between">
        {/* Left Column with Heading */}
        <div className="w-full md:max-w-[45%] mb-4 md:mb-0 text-center md:text-left bg-black/60 md:bg-black/30 p-6 md:p-6 rounded-xl shadow-lg backdrop-blur-sm">
          {richText && <RichText className="mb-4 md:mb-6 [&>h1]:text-2xl sm:[&>h1]:text-3xl md:[&>h1]:text-4xl lg:[&>h1]:text-5xl [&>h1]:font-bold [&>h1]:mb-2 md:[&>h1]:mb-4" data={richText} enableGutter={false} />}
          
          {/* Mobile-only donation button */}
          <div className="md:hidden mt-6 mb-2">
            <Button 
              onClick={() => setShowMobileDonation(true)}
              variant="flame"
              className="w-full py-6 text-lg font-medium shadow-lg"
              size="lg"
              withArrow
            >
              Faire un don maintenant
            </Button>
          </div>
          
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
        
        {/* Right Column with Donation Card - Desktop Only */}
        <div className="hidden md:block md:max-w-[45%] mt-40">
          <DonationCard />
        </div>
      </div>
      
      {/* Mobile-only fullscreen donation card */}
      {showMobileDonation && (
        <>
          <TouchableOverlay onClose={() => setShowMobileDonation(false)} />
          <div className="fixed inset-x-0 bottom-0 bg-white z-50 rounded-t-xl shadow-xl md:hidden animate-slide-up">
            <div className="p-4 sticky top-0 bg-white border-b flex justify-between items-center">
              <h2 className="text-black font-medium text-lg">Faire un don</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowMobileDonation(false)}
                className="text-gray-500"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <DonationCard className="shadow-none" />
            </div>
          </div>
        </>
      )}
      
      <div className="min-h-[65vh] sm:min-h-[70vh] md:min-h-[80vh] select-none py-8 md:py-0">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover brightness-[0.85] md:brightness-100" priority resource={media} />
        )}
      </div>
    </div>
  )
}