import React from 'react'

interface TwistedLineIconProps {
  className?: string
  width?: number | string
  height?: number | string
  fill?: string
  stroke?: string
  strokeWidth?: number
}

export const TwistedLineIcon: React.FC<TwistedLineIconProps> = ({
  className,
  width = 180,
  height = 16,
  fill = "#FD4A18",
  stroke = fill,
  strokeWidth = 4
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 180 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M2 13.9265C33.5 1.99993 45.3618 -0.795551 76.5 3.42653C107.638 7.64861 122.845 18.5 154 10.9265C170.065 6.9411 175.674 5.89342 180 5.89342" 
        stroke={stroke} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
      />
    </svg>
  )
}