'use client'

import React from 'react'

type WaveDividerProps = {
  fillColor?: string
  className?: string
  position?: 'top' | 'bottom'
  height?: number
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  fillColor = '#ffffff',
  className = '',
  position = 'top',
  height = 70,
}) => {
  const styles = {
    width: '100%',
    height: `${height}px`,
    [position]: 0,
    left: 0,
    lineHeight: 0,
    transform: position === 'bottom' ? 'rotate(180deg)' : 'none',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 2,
  } as React.CSSProperties

  return (
    <div style={styles} className={className}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1000 100" 
        preserveAspectRatio="none"
        style={{
          position: 'relative',
          display: 'block',
          width: 'calc(100% + 1.3px)',
          height: '100%',
        }}
      >
        <path 
          d="M0 100v-60c9 0 18 3 25 10 13 14 36 14 50 0s36-14 50 0c13 14 36 14 50 0s36-14 50 0c13 14 36 14 50 0s36-14 50 0c13 14 36 14 50 0s36-14 50 0c13 14 36 14 50 0s36-14 50 0c13 14 36 14 50 0s36-14 50 0c13 14 36 14 50 0s36-14 50 0c13 14 36 14 50 0s36-14 50 0c13 14 36 14 50 0s37-13 50 0c14 14 37 14 50 0 7-7 16-10 25-10V100H0Z" 
          fill={fillColor}
        />
      </svg>
    </div>
  )
}