import React from 'react'

function Logo({ className = "w-[42px] h-[42px]" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="movieExplorerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#01b4e4" />
          <stop offset="100%" stopColor="#90cea1" />
        </linearGradient>
      </defs>
      <path 
        fillRule="evenodd" 
        fill="url(#movieExplorerGrad)" 
        d="M 194 100 A 94 94 0 1 0 6 100 A 94 94 0 1 0 194 100 Z M 178 100 A 78 78 0 1 0 22 100 A 78 78 0 1 0 178 100 Z M 89.0 3.0 L 111.0 3.0 L 111.0 25.0 L 89.0 25.0 Z M 160.81 23.63 L 176.37 39.19 L 160.81 54.75 L 145.25 39.19 Z M 197.0 89.0 L 197.0 111.0 L 175.0 111.0 L 175.0 89.0 Z M 176.37 160.81 L 160.81 176.37 L 145.25 160.81 L 160.81 145.25 Z M 111.0 197.0 L 89.0 197.0 L 89.0 175.0 L 111.0 175.0 Z M 39.19 176.37 L 23.63 160.81 L 39.19 145.25 L 54.75 160.81 Z M 3.0 111.0 L 3.0 89.0 L 25.0 89.0 L 25.0 111.0 Z M 23.63 39.19 L 39.19 23.63 L 54.75 39.19 L 39.19 54.75 Z M 146 100 A 46 46 0 1 0 54 100 A 46 46 0 1 0 146 100 Z M 85 76 L 130 100 L 85 124 Z"
      />
    </svg>
  )
}

export default Logo
