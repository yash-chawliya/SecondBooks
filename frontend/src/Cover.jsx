import React from 'react'
import cover from './assets/cover2.webp' // Assuming you converted to WebP

const Cover = () => {
  return (
    <div className='h-[40vw] bg-black'>
      <img 
        src={cover} 
        alt="Promotional banner for SecondBooks" 
        className='w-full h-full object-cover object-top'
        fetchpriority="high"
      />
    </div>
  )
}

export default Cover