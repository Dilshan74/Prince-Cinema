import React from 'react'

const BlurCircle = ({
  className = '',
  color = 'bg-red-500/30',
  size = 'h-48 w-48',
  top = 'top-0',
  left = 'left-0',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${color} ${size} ${top} ${left} blur-3xl ${className}`}
    />
  )
}

export default BlurCircle
