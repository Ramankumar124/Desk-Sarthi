'use client'
import React from 'react'

const Sidebar=() => {
    const scrollToSection = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

  return (
    <aside className='w-1/6 h-full bg-primary text-primary hidden lg:flex flex-col p-5 '
    >
      <h1 className=' text-4xl font-bold'>Desk Sarthi</h1>
  <nav className='text-secondary pl-3 mt-12 '>
    <ul className='flex  flex-col gap-4 text-3xl'>
          <li onClick={() => scrollToSection('Overview')}>Overview</li>
          <li onClick={() => scrollToSection('music-player')}>Music Player</li>
          <li onClick={() => scrollToSection('light-controll')}>light Controll</li>
          <li onClick={() => scrollToSection('analytics')}>analytics</li>
    </ul>
  </nav>
    </aside>
  )
}

export default Sidebar;