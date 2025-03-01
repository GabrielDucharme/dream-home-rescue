import React from 'react'

interface PlayIconProps {
  className?: string
  width?: number | string
  height?: number | string
  fill?: string
}

export const PlayIcon: React.FC<PlayIconProps> = ({
  className,
  width = 24,
  height = 24,
  fill = "#FFFFFF"
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M8 5.14V19.14L19 12.14L8 5.14Z" 
        fill={fill}
      />
    </svg>
  )
}