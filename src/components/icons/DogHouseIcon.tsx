import React from 'react'

interface DogHouseIconProps {
  width?: number
  height?: number
  className?: string
}

export const DogHouseIcon: React.FC<DogHouseIconProps> = ({ 
  width = 24, 
  height = 24,
  className 
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
        d="M23.4835 17.5179C23.6481 18.1452 23.2763 18.7863 22.653 18.9498L4.59725 23.6862C3.97401 23.8497 3.33536 23.4737 3.17078 22.8463L0.0386902 10.9064C-0.0532648 10.5558 0.0207049 10.1827 0.23914 9.89542L7.41294 0.45903C7.73675 0.0330909 8.30731 -0.11658 8.7985 0.0955701L19.6805 4.79554C20.0119 4.93864 20.2595 5.22737 20.3514 5.57791L23.4835 17.5179Z" 
        fill="#FD4A18"
      />
    </svg>
  )
}