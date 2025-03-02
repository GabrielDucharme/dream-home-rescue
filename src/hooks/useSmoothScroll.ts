'use client'

import { useCallback, useEffect } from 'react'

export const useSmoothScroll = () => {
  // Handle smooth scrolling when clicking on hash links
  const scrollToSection = useCallback((e: MouseEvent, targetId: string) => {
    e.preventDefault()
    
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      // Add offset for fixed header (adjust the value based on your header height)
      const headerOffset = 80
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Update URL without triggering a page reload
      window.history.pushState(null, '', `#${targetId}`)
    }
  }, [])
  
  // Handle initial hash in URL when page loads
  useEffect(() => {
    const handleInitialScroll = () => {
      const hash = window.location.hash
      if (hash) {
        const targetId = hash.replace('#', '')
        const targetElement = document.getElementById(targetId)
        
        if (targetElement) {
          // Delay to ensure page is fully loaded
          setTimeout(() => {
            const headerOffset = 80
            const elementPosition = targetElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }, 100)
        }
      }
    }
    
    // Run on mount
    handleInitialScroll()
    
    // Add event listener for back/forward navigation
    window.addEventListener('popstate', handleInitialScroll)
    
    return () => {
      window.removeEventListener('popstate', handleInitialScroll)
    }
  }, [])
  
  return { scrollToSection }
}