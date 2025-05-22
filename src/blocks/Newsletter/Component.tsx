'use client'

import React, { useState } from 'react'
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
  id,
}) => {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showNameFields, setShowNameFields] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.message || 'Merci de vous être abonné(e) !',
        })
        setEmail('')
      } else {
        setMessage({
          type: 'error',
          text: data.error || "Quelque chose s'est mal passé. Veuillez réessayer.",
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: "Impossible de s'abonner. Veuillez réessayer plus tard.",
      })
    } finally {
      setLoading(false)
    }
  }

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

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={emailPlaceholder || 'Votre adresse courriel'}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription en cours...' : buttonText}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
            >
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4 text-center max-w-2xl mx-auto">
            En vous abonnant, vous acceptez notre politique de confidentialité et consentez à
            recevoir des mises à jour de notre organisation.
          </p>
        </div>
      </div>
    </div>
  )
}
