import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import React from 'react'
import { fraunces, geistMono, geistSans } from '@/app/fonts'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/react'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { MobileDonationTrigger } from './components/MobileDonationTrigger'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  
  // Import generateOrganizationSchema from our schema utilities
  const { generateOrganizationSchema } = await import('@/utilities/schema')
  
  // Generate organization schema
  const orgSchema = generateOrganizationSchema()

  return (
    <html className={cn(
      geistSans.variable, 
      geistMono.variable,
      fraunces.variable
    )} lang="fr" data-theme="light">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        {/* Add organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgSchema)
          }}
        />
      </head>
      <body className="font-sans">
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
          <MobileDonationTrigger />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@dreamhomerescue',
  },
}
