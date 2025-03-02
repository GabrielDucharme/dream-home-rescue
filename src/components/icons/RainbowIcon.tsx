import React from 'react'

export type RainbowIconProps = {
  className?: string
  width?: number
  height?: number
}

export const RainbowIcon: React.FC<RainbowIconProps> = ({ 
  className, 
  width = 71, 
  height = 40 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 71 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M58.8778 39.4287C57.7659 22.1842 53.7821 6.90988 30.9654 13.1201C15.4264 17.3473 11.3096 26.2065 10.625 39.4287H17.674C18.0944 29.537 20.7165 23.2782 32.8843 19.9579C49.9187 15.3079 51.5532 26.8137 51.9324 39.4287H58.8778Z" 
        fill="#FDC55B"
      />
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M7.09095 39.4326C8.79277 15.8678 24.1593 4.4541 49.9418 7.6342C63.633 9.32134 63.5963 27.9061 62.9324 39.4326H69.967C70.5626 24.0962 69.5445 2.92441 50.7762 0.578693C20.6985 -3.17865 1.89599 11.5542 0 39.4326H7.09095Z" 
        fill="#FC8E39"
      />
    </svg>
  )
}