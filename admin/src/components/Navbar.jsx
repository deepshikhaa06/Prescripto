import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext.jsx';

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext);
    const {dToken,setDToken}=useContext(DoctorContext)

    const navigate=useNavigate()

    const handleLogout = () => {
      // Clear the token from localStorage and context, then redirect to login
     aToken && localStorage.removeItem('aToken');
     aToken && setAToken('');
     dToken && localStorage.removeItem('dToken');
     dToken && setDToken('');
      navigate('/')
    };
  
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <div className="flex items-center">
        {/* Logo with rounded border and width */}
        <img src={assets.admin_logo} alt="Admin Logo" className="w-36 sm:w-40 " />

        {/* Text with proper spacing and sizing */}
        <p className="ml-4 pr-3 pl-3 text-xl sm:text-lg rounded-full border border-gray-300">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>

      {/* Logout button */}
      <button onClick={handleLogout}  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
