import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border text-gray-800" style={{ background: '#EDEBE0' }}>
      {/* Main footer content with container */}
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex items-start md:flex-row gap-4 md:items-center">
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
      
      {/* Absolutely positioned image to ensure it's flush with the left edge */}
      <div className="relative w-full" style={{ height: '20rem' }}>
        <div className="absolute left-0 bottom-0">
          <Image 
            src="/footer-dhr.png" 
            alt="DHR Footer" 
            width={1200} 
            height={360} 
            className="h-auto w-auto max-w-[66vw]"
            priority
          />
        </div>
      </div>
    </footer>
  )
}
