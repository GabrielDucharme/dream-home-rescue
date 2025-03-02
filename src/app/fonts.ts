import { Fraunces } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

// Defining Fraunces font with different styles and weights
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  // Include both normal and italic styles
  style: ['normal', 'italic'],
  // For variable fonts, use 'variable' for weight to enable axes support
  weight: 'variable',
  // Define the variable font axes
  axes: ['SOFT', 'WONK', 'opsz'],
})

// Re-export Geist fonts for consistency
export const geistSans = GeistSans
export const geistMono = GeistMono