import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import RichText from '@/components/RichText'
import { DogHouseIcon, PawIcon, DogBoneIcon } from '@/components/icons'

import type { Dog } from '@/payload-types'
import { QuiNousSommesClient } from './QuiNousSommesClient'

export const Component: React.FC<QuiNousSommesBlock> = async (props) => {
  const {
    heading = 'Refuge et Sanctuaire pour chien',
    introduction = 'Nous offrons un refuge sécuritaire et aimant pour les chiens abandonnés, maltraités ou en détresse.',
    description,
    backgroundColor = 'gradient',
    adoptionLimit = 4,
  } = props

  let adoptedDogs: Dog[] = []
  let fetchError: string | null = null

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'dogs',
      where: {
        status: {
          equals: 'adopted',
        },
      },
      limit: adoptionLimit,
      sort: '-updatedAt',
      depth: 1,
      overrideAccess: true,
    })
    adoptedDogs = result.docs as Dog[]
  } catch (error) {
    console.error('Error fetching adopted dogs via Local API:', error)
    fetchError = 'Could not load recent adoptions.'
  }

  return (
    <div
      className={`relative ${backgroundColor === 'gradient' ? 'bg-gradient-to-b from-[#FFF6CB] via-[#FCFAEB] to-[#F9F9F9]' : backgroundColor}`}
    >
      <div className="container py-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <DogHouseIcon
                width={18}
                height={18}
                className="text-[#26483B] opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-300"
              />
              <PawIcon
                width={16}
                height={16}
                className="text-[#26483B] opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-bounce"
              />
              <DogBoneIcon
                width={18}
                height={16}
                className="text-[#26483B] opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-600"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#26483B]">{heading}</h2>

            {introduction && (
              <p className="text-lg text-gray-700 mb-7 leading-relaxed">{introduction}</p>
            )}

            {description && (
              <div className="prose prose-amber max-w-none bg-white/60 rounded-lg p-5">
                <RichText data={description} enableGutter={false} />
              </div>
            )}
          </div>

          <div>
            <QuiNousSommesClient initialAdoptedDogs={adoptedDogs} fetchError={fetchError} />
          </div>
        </div>
      </div>
    </div>
  )
}
