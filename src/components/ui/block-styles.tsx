import { cn } from '@/utilities/ui'

/**
 * Block Styles
 * 
 * This file provides standardized styling functions for block components
 * to ensure consistent typography, spacing, and colors across the site.
 */

// Section wrapper styles with consistent spacing
export const sectionWrapper = (
  bgColor?: string,
  className?: string
) => {
  return cn(
    'section-spacing',
    {
      [`bg-${bgColor}`]: bgColor
    },
    className
  )
}

// Container styles for consistent horizontal padding
export const blockContainer = (className?: string) => {
  return cn('container', className)
}

// Content wrapper styles for consistent vertical spacing
export const contentWrapper = (
  size: 'small' | 'default' | 'large' = 'default',
  className?: string
) => {
  return cn(
    {
      'content-spacing-small': size === 'small',
      'content-spacing': size === 'default',
      'content-spacing-large': size === 'large',
    },
    className
  )
}

// Heading styles for consistent typography
export const blockHeading = (
  size: 'small' | 'default' | 'large' = 'default',
  className?: string
) => {
  return cn(
    'font-fraunces font-medium',
    {
      'text-2xl md:text-3xl': size === 'small',
      'text-3xl md:text-4xl': size === 'default',
      'text-4xl md:text-5xl': size === 'large',
    },
    'mb-4',
    className
  )
}

// Subheading styles
export const blockSubheading = (
  size: 'small' | 'default' | 'large' = 'default',
  className?: string
) => {
  return cn(
    'font-fraunces',
    {
      'text-xl': size === 'small',
      'text-2xl': size === 'default',
      'text-3xl': size === 'large',
    },
    'mb-3',
    className
  )
}

// Label styles
export const blockLabel = (className?: string) => {
  return cn(
    'text-xs font-medium uppercase tracking-wider text-primary mb-2',
    className
  )
}

// Paragraph styles
export const blockParagraph = (
  size: 'small' | 'default' | 'large' = 'default',
  className?: string
) => {
  return cn(
    {
      'text-sm': size === 'small',
      'text-base': size === 'default',
      'text-lg': size === 'large',
    },
    'text-muted-foreground',
    className
  )
}

// Button wrapper styles
export const buttonWrapper = (className?: string) => {
  return cn('mt-6', className)
}

// Card styles
export const blockCard = (className?: string) => {
  return cn(
    'bg-card rounded-lg shadow-sm p-6',
    className
  )
}

// Grid styles
export const blockGrid = (
  columns: 1 | 2 | 3 | 4 = 2,
  className?: string
) => {
  return cn(
    'grid gap-6 md:gap-8',
    {
      'grid-cols-1': columns === 1,
      'grid-cols-1 md:grid-cols-2': columns === 2,
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === 3,
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': columns === 4,
    },
    className
  )
}

// Rich text wrapper styles
export const richTextWrapper = (className?: string) => {
  return cn('rich-text', className)
}