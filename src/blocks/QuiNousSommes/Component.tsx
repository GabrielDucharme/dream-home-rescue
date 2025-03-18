import React from 'react'
import RichText from '@/components/RichText'
import { DogHouseIcon, PawIcon, DogBoneIcon } from '@/components/icons'

import type { QuiNousSommesBlock } from '@/payload-types'
import { QuiNousSommesClient } from './QuiNousSommesClient'

export const Component: React.FC<QuiNousSommesBlock> = (props) => {
  const { 
    heading = 'Refuge et Sanctuaire pour chien', 
    introduction = 'Nous offrons un refuge sécuritaire et aimant pour les chiens abandonnés, maltraités ou en détresse.',
    description,
    backgroundColor = 'gradient',
    adoptionLimit = 4
  } = props

  return (
    <div className={`relative ${backgroundColor === 'gradient' ? 'bg-gradient-to-b from-[#FFF6CB] via-[#FCFAEB] to-[#F9F9F9]' : backgroundColor}`}>
      <div className="container py-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-4 mb-1">
              <DogHouseIcon width={18} height={18} className="text-[#26483B] opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-300" />
              <PawIcon width={16} height={16} className="text-[#26483B] opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-bounce" />
              <DogBoneIcon width={18} height={16} className="text-[#26483B] opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{heading}</h2>
            
            {introduction && (
              <p className="text-lg text-gray-700 mb-6">{introduction}</p>
            )}
            
            {description && (
              <div className="prose prose-amber max-w-none">
                <RichText data={description} enableGutter={false} />
              </div>
            )}
          </div>
          
          <div>
            <QuiNousSommesClient adoptionLimit={adoptionLimit} />
          </div>
        </div>
      </div>
    </div>
  )
}