import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container pb-16">
      <div className="content-spacing grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-8 md:gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                <div
                  className={cn('content-spacing-small', {
                    'mx-auto max-w-2xl': size === 'full',
                  })}
                >
                  {richText && <RichText data={richText} enableGutter={false} />}
                  {enableLink && (
                    <div className="mt-4">
                      <CMSLink {...link} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
