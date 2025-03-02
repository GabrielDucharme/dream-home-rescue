'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

interface SmoothScrollLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export const SmoothScrollLink: React.FC<SmoothScrollLinkProps> = ({ 
  href, 
  children, 
  className,
  onClick
}) => {
  const { scrollToSection } = useSmoothScroll()
  
  const handleClick = (e: React.MouseEvent) => {
    // Only handle hash links
    if (href.startsWith('#')) {
      const targetId = href.substring(1)
      scrollToSection(e as unknown as MouseEvent, targetId)
      
      // Call any additional onClick handler provided
      if (onClick) onClick(e)
    }
  }
  
  return (
    <Link 
      href={href} 
      className={cn(className)} 
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}