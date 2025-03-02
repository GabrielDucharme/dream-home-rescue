import React from 'react'
import type { NewsletterBlock as NewsletterBlockProps } from '@/payload-types'
import { WaveDivider } from '@/components/Divider/WaveDivider'
import RichText from '@/components/RichText'
import { RainbowIcon } from '@/components/icons'

export const NewsletterBlock: React.FC<NewsletterBlockProps & { id?: string }> = ({ 
  heading, 
  subheading, 
  buttonText,
  emailPlaceholder,
  richText,
  useWaveDivider,
  id
}) => {
  return (
    <div className="relative my-0" id={`block-${id}`}>
      {useWaveDivider && (
        <div className="relative h-16">
          <WaveDivider fillColor="#EDEBE0" height={64} />
        </div>
      )}
      <div className="py-16 px-4" style={{ background: '#EDEBE0', marginTop: '-1px' }}>
        <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-md p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 mt-6 mr-6 md:mt-8 md:mr-8">
            <RainbowIcon width={60} height={34} />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">{heading}</h2>
            {subheading && <p className="text-lg text-gray-600">{subheading}</p>}
          </div>
          
          {richText && (
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <RichText data={richText} />
            </div>
          )}
          
          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder={emailPlaceholder || "Your email address"}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              {buttonText}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-4 text-center max-w-2xl mx-auto">
            By subscribing, you agree to our privacy policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </div>
  )
}