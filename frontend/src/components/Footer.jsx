import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* left Section */}
        <div>
            <img src={assets.logo} className='mb-5 w-40'></img>
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda sunt et vel, quia eius unde laudantium earum ab vitae sed.</p>
        </div>
        {/* middle Section */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        {/* right Section */}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+1-232-234-342</li>
                    <li>great@gmail.com</li>
                </ul>
        </div>
      </div>
      {/* Copyright Section */}
      <div>
        <hr></hr>
        <p className='py-5 text-sm text-center'>�� 2021 My Website. All rights reserved.</p>
  </div>
    </div>
  )
}

export default Footer
