'use client'

import React, { useState, useEffect } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/ui'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [currentHash, setCurrentHash] = useState<string>('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Get the initial hash and set up an event listener for hash changes
  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash)

    // Set initial hash
    updateHash()

    // Update hash when it changes
    window.addEventListener('hashchange', updateHash)

    return () => {
      window.removeEventListener('hashchange', updateHash)
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const renderNavLinks = (additionalClasses = '', onLinkClick?: () => void) => {
    return navItems.map(({ link }, i) => {
      // Check if this is a hash link (one-page navigation)
      const isHashLink = link.type === 'custom' && link.url?.startsWith('#')

      // For hash links, check if the hash in the URL matches
      // For regular links, check if the path matches
      const isActive = isHashLink
        ? currentHash === link.url
        : (link.type === 'reference' &&
            typeof link.reference?.value === 'object' &&
            link.reference.value.slug &&
            pathname ===
              `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`) ||
          (link.type === 'custom' && !isHashLink && pathname === link.url)

      return (
        <CMSLink
          key={i}
          {...link}
          appearance="custom"
          className={cn(
            `font-medium transition-colors hover:text-primary`,
            isActive ? 'text-primary' : 'text-gray-600',
            additionalClasses,
          )}
          onClick={onLinkClick}
        />
      )
    })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center h-full px-4">
        {renderNavLinks()}
        <Link href="/search" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-gray-600 hover:text-primary" />
        </Link>
      </nav>

      {/* Mobile Burger Button */}
      <button
        className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-800" />
        ) : (
          <Menu className="w-6 h-6 text-gray-800" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-30 transition-opacity duration-300',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation */}
      <nav
        className={cn(
          'fixed top-0 right-0 h-full w-4/5 max-w-[300px] bg-white z-40 shadow-xl p-6 overflow-y-auto transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex justify-end mb-6">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </div>
        <div className="flex flex-col items-start gap-5">
          {renderNavLinks('text-lg py-1', () => setIsMobileMenuOpen(false))}
          <Link
            href="/search"
            className="flex items-center gap-2 font-medium text-lg text-gray-600 hover:text-primary transition-colors py-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <SearchIcon className="w-5" />
            <span>Search</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
