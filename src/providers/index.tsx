import React from 'react'

// Simplified provider without theming
export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <>{children}</>
}
