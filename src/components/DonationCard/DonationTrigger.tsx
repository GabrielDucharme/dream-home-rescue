'use client'
import React, { useState } from 'react'
import { MobileDonationCard } from './MobileDonationCard'
import { Button, ButtonProps } from '@/components/ui/button'

interface DonationTriggerProps extends ButtonProps {
  triggerText?: string
  floating?: boolean
}

export const DonationTrigger: React.FC<DonationTriggerProps> = ({
  triggerText = 'Faire un don',
  floating = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)

  if (floating) {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-4 right-4 shadow-lg z-40 rounded-full h-14 w-14 md:h-16 md:w-16 p-0 flex items-center justify-center ${className}`}
          variant="flame"
          {...props}
        >
          <span className="sr-only">{triggerText}</span>
          <HeartIcon className="h-6 w-6 md:h-8 md:w-8" />
        </Button>
        <MobileDonationCard isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    )
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className={className}
        variant="flame"
        {...props}
      >
        {triggerText}
      </Button>
      <MobileDonationCard isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

// Simple heart icon component
const HeartIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
)