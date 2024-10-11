import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const navigate=useNavigate()
    const {token,setToken,userData,backendUrl} = useContext(AppContext)
   
    const [showMenu,setShowMenu] = useState(false)
    const logout=()=>{
      setToken(false)
      localStorage.removeItem('token');
    }
  return (
    <div className='flex items-center justify-between text-md mb-5 border-b border-b-gray-400 p-2'>
     <img className="w-44 cursor-pointer" src={assets.logo} alt='logo' onClick={()=>navigate('/')}/>
     <ul className='hidden md:flex items-start gap-5 font-medium'>
     <NavLink to='/'>
        <li className='py-1'>HOME</li>
        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
     </NavLink>
     <NavLink to='/about'>
        <li className='py-1'>ABOUT</li>
        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
     </NavLink>
     <NavLink to='/doctors'>
        <li className='py-1'>ALL DOCTORS</li>
        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
     </NavLink>
     <NavLink to='/contact'>
        <li className='py-1'>Contact</li>
        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
     </NavLink>
     <NavLink to={backendUrl}>
      <li>Admin</li>
     </NavLink>
     </ul>
     <div className='flex items-center gap-4 '>
        {
            token &&userData
            ? <div className='flex items-center gap-4 cursor-pointer group relative'>
                <img className="w-10 rounded-full "src={userData.image}/>
                <img className="w-2.5" src={assets.dropdown_icon}/> 
                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                   <div className='min-w-48 gap-4 p-3 bg-stone-200 rounded flex flex-col'>
                   <p onClick={()=>navigate('my-profile')} className='cursor-pointer hover:text-black'>My Profile</p>
                    <p onClick={()=>navigate('my-appointments')} className='cursor-pointer hover:text-black'>My Appointments</p>
                    <p onClick={logout}className='cursor-pointer hover:text-black'>logout</p>
                   </div>
                </div>
            </div>
            : <button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-normal hidden md:block'>Create Account</button>
        }
        <img onClick={()=>setShowMenu(true)} className="w-6 md:hidden"src={assets.menu_icon}/>
        {/* Mobile Menu */}
        <div className={`${showMenu?'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
         <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36'/>
            <img onClick={()=>setShowMenu(false)} src={assets.cross_icon} className='w-7'/>
         </div>
         <ul className={`text-center flex flex-col gap-5 font-medium ${showMenu? 'block' : 'hidden'}`}>
            <NavLink to='/' onClick={()=>setShowMenu(false)} ><p className='py-1 cursor-pointer'>HOME</p></NavLink>
            <NavLink to='/about' onClick={()=>setShowMenu(false)} ><p className='py-1 cursor-pointer'>ABOUT</p></NavLink>     
            <NavLink to='/doctors'onClick={()=>setShowMenu(false)}><p className='py-1 cursor-pointer'>ALL DOCTORS</p></NavLink>
            <NavLink to='/contact'onClick={()=>setShowMenu(false)} ><p className='py-1 cursor-pointer'>CONTACT</p></NavLink>
            </ul>
        </div>
     </div>
    </div>
  )
}

export default Navbar
