'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <nav className="flex gap-6 items-center h-full px-4">
      {navItems.map(({ link }, i) => {
        const isActive = 
          (link.type === 'reference' && 
           typeof link.reference?.value === 'object' && 
           link.reference.value.slug && 
           pathname === `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`) ||
          (link.type === 'custom' && 
           pathname === link.url);
           
        return (
          <CMSLink 
            key={i} 
            {...link} 
            appearance="custom" 
            className={`font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-gray-600'}`} 
          />
        )
      })}
      <Link href="/search" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-gray-600 hover:text-primary" />
      </Link>
    </nav>
  )
}
