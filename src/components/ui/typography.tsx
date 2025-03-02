import React from 'react'
import { cn } from '@/utilities/ui'

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

// H1 Component
export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn('heading-display', className)}>
      {children}
    </h1>
  )
}

// H2 Component
export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn('heading-serif', className)}>
      {children}
    </h2>
  )
}

// H3 Component
export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn('heading-crisp', className)}>
      {children}
    </h3>
  )
}

// H4 Component
export function H4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn(className)}>
      {children}
    </h4>
  )
}

interface ParagraphProps extends TypographyProps {
  size?: 'default' | 'small' | 'large' | 'xl'
}

// Paragraph Component
export function P({ 
  children, 
  className, 
  size = 'default' 
}: ParagraphProps) {
  return (
    <p 
      className={cn(
        size === 'small' && 'prose-sm',
        size === 'large' && 'prose-lg',
        size === 'xl' && 'prose-xl',
        'text-pretty',
        className
      )}
    >
      {children}
    </p>
  )
}

// Quote Component
export function Quote({ children, className }: TypographyProps) {
  return (
    <blockquote className={cn('font-serif', className)}>
      {children}
    </blockquote>
  )
}

// Lead Paragraph
export function Lead({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-xl md:text-2xl font-medium font-serif text-muted-foreground', className)}>
      {children}
    </p>
  )
}

// Muted Text
export function Muted({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  )
}