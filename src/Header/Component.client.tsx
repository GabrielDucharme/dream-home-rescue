'use client'
import Link from 'next/link'
import React from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { PawIcon } from '@/components/icons'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  return (
    <header className="sticky top-4 container relative z-20 bg-white rounded-3xl shadow-md">
      <div className="h-[65px] flex justify-between items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <PawIcon width={20} height={20} fill="#051436" />
          <Logo loading="eager" priority="high" />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
