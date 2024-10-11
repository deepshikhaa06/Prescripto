import React, { useContext } from 'react'
import Login from './pages/Login'
import {ToastContainer} from'react-toastify'
import'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllApointment from './pages/Admin/AllApointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import {DoctorContext} from './context/DoctorContext'
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';

const App = () => {
  const {aToken}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)
  return aToken ||dToken? (
   <div className='bg-purple-50'>
   <ToastContainer/>
   <Navbar/>
   <div className='flex items-start'>
    <Sidebar />
    <Routes>
      {/* Admin Route */}
      <Route path='/' element={<></>}/>
      <Route path='/admin-dashboard' element={<Dashboard/>}/>
      <Route path='/all-appointments' element={<AllApointment/>}/>
      <Route path='/add-doctor' element={<AddDoctor/>}/>
      <Route path='/doctor-list' element={<DoctorsList/>}/>
      {/* Doctor Route */}
      <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
      <Route path='/doctor-appointments' element={<DoctorAppointment/>}/>
      <Route path='/doctor-profile' element={<DoctorProfile/>}/>
      {/* Default Route */}
      <Route path='*' element={<h1>Not found</h1>}/>
    </Routes>
   </div>
   </div>
  ) :(
    <>
    <Login/>
    <ToastContainer/>
    </>
  )
}

export default App
