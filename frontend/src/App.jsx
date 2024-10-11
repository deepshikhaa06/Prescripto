import {Routes,Route} from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './pages/Home'
import Footer from './components/Footer'
import Doctor from './pages/Doctor'
import Appointment from './pages/Appointment'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Myprofile from './pages/Myprofile'
import MyAppointment from './pages/MyAppointment'
import {ToastContainer} from 'react-toastify'
import'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/appointment/:docId" element={<Appointment />}/>
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-appointments" element={<MyAppointment />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/my-profile" element={<Myprofile />} />
        <Route path="*" element={<h1>Not FOUND</h1>} />
      </Routes> 
      <Footer/>
    </div>
    </>
  )
}

export default App
