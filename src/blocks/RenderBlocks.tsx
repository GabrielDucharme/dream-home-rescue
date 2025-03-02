import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutUsBlock } from '@/blocks/AboutUs/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { AvailableDogsBlock } from '@/blocks/AvailableDogs/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { Component as NosServicesBlock } from '@/blocks/NosServices/Component'
import { Component as RecentAdoptionsBlock } from '@/blocks/RecentAdoptions/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { NewsletterBlock } from '@/blocks/Newsletter/Component'
import { Component as DonationGoalDisplayBlock } from '@/blocks/DonationGoalDisplay/Component'
import { Component as WhereToFindUsBlock } from '@/blocks/WhereToFindUs/Component'

const blockComponents = {
  aboutUs: AboutUsBlock,
  archive: ArchiveBlock,
  availableDogs: AvailableDogsBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  donationGoalDisplay: DonationGoalDisplayBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  nosServices: NosServicesBlock,
  recentAdoptions: RecentAdoptionsBlock,
  testimonials: TestimonialsBlock,
  newsletter: NewsletterBlock,
  whereToFindUs: WhereToFindUsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <section 
                  className="section-spacing" 
                  key={index}
                  id={`block-${blockType}-${index}`}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </section>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}