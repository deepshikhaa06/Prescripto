import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const ContactUs = () => {
  return (
    <div className="p-8 bg-gray-100 text-gray-700">
      {/* Contact Us Section */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">CONTACT US</h1>
      <div className='flex gap-7'>
      <img src={assets.contact_image} className='w-[40%] '/>
      {/* Our Office Section */}
      <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">OUR OFFICE</h2>
        <p>00000 Willms Station</p>
        <p>Suite 000, Washington, USA</p>
        <p>Tel: (000) 000-0000</p>
        <p>Email: <a href="mailto:greatstackdev@gmail.com" className="text-blue-600">greatstackdev@gmail.com</a></p>
      </div>

      {/* Careers Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">CAREERS AT PRESCRIPTO</h2>
        <p>Learn more about our teams and job openings.</p>
        <a href="/careers" className="text-blue-600 hover:underline mt-2 block">Explore Jobs</a>
      </div>
      </div>
      </div>
    </div>
  );
};

export default ContactUs;

