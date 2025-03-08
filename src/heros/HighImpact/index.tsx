'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { DonationCard } from '@/components/DonationCard'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

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
        <div className="w-full md:max-w-[45%] mt-20">
          <DonationCard />
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