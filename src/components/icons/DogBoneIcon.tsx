import React from 'react'

interface DogBoneIconProps {
  width?: number
  height?: number
  className?: string
}

export const DogBoneIcon: React.FC<DogBoneIconProps> = ({ 
  width = 32, 
  height = 29,
  className 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 32 29" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M24.2981 11.3224L12.0896 22.021C12.0896 22.021 15.2102 25.1619 12.2474 27.7039C9.88898 29.7276 5.79535 27.608 5.97099 24.2127C5.97099 24.2127 -0.275156 26.0801 0.00943801 20.8589C0.253205 16.3848 7.55645 18.6457 7.55645 18.6457L20.2457 7.24958C20.2457 7.24958 16.4358 1.39343 20.8628 0.17803C25.2899 -1.03737 25.704 4.36843 25.704 4.36843C25.704 4.36843 31.6985 3.4575 31.9921 8.56591C32.2857 13.6758 24.2981 11.3224 24.2981 11.3224Z" 
        fill="#FF740C"
      />
    </svg>
  )
}