import React from 'react'
import { IoNotificationsOutline } from 'react-icons/io5'

const Header:React.FC = () => {
  return (
<header className='h-20 py-4 px-7 bg-primary text-primary w-full
flex items-center justify-between ' >
<h1 className='text-xl md:text-4xl font-bold'>Iot Dashboard</h1>

<div id='header-end' className='flex gap-4'
>
<IoNotificationsOutline className='text-3xl mt-1
items-center' />

<div id="device-status-indecator"
className='flex items-center rounded-full px-3 py-2 bg-gray-700 gap-3'>

<div className="PulseIndicator relative h-4 w-4">
  <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
  <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
  <div className="absolute inset-0 bg-green-500 rounded-full opacity-50 animate-ping delay-200"></div>
</div>

{/* <div className='text-green-500 text-sm'>System Active</div> */}
    </div>
</div>
</header>
  )
}

export default Header