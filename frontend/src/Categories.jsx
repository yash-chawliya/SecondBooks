import React from 'react'
import './App.css'
import jee from './assets/jee.png'
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  return (

    <div className='bg-gray-400 top-[80px] sticky '>

      <div className='h-[34px] flex items-center justify-evenly bg-blue-900'>
        <div className='hover:border-[1px] hover:border-white py-[2px] px-[4px] text-white font-medium cursor-pointer' onClick={() => { navigate('/exam?exam=jee&subject=all') }}>JEE</div>
        <div className='hover:border-[1px] hover:border-white py-[2px] px-[4px] text-white font-medium cursor-pointer' onClick={() => { navigate('/exam?exam=neet&subject=all') }}>NEET</div>
        <div className='hover:border-[1px] hover:border-white py-[2px] px-[4px] text-white font-medium cursor-pointer' onClick={() => { navigate('/exam?exam=CBSE10&subject=all') }}>Class 10</div>
        <div className='hover:border-[1px] hover:border-white py-[2px] px-[4px] text-white font-medium cursor-pointer' onClick={() => { navigate('/exam?exam=CBSE11&subject=all') }}>Class 11</div>
        <div className='hover:border-[1px] hover:border-white py-[2px] px-[4px] text-white font-medium cursor-pointer' onClick={() => { navigate('/exam?exam=CBSE12&subject=all') }}>Class 12</div>
      </div>
    </div>
  )
}

export default Categories
