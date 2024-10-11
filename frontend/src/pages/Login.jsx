import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const CreateAccount = () => {
  const {backendUrl,token,setToken} = useContext(AppContext)

  const [state,setState]=useState("Sign up")
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [name, setName]=useState("")

  const navigate = useNavigate();

  // Handler for form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form data:', formData);
    try {
      if(state ==='Sign up'){
        const {data}=await axios.post(`${backendUrl}/api/user/register`, {email,password,name})
        if(data.success){
          toast.success("Account created successfully. Please login.")
          localStorage.setItem("token", data.token)
          setToken(data.token)
        }else{
          toast.error(data.message)
        }
      }else{
        // const {data}=await axios.get(`${backendUrl}/api/doctor/list`, {email,password})
        const {data}=await axios.post(`${backendUrl}/api/user/login`, {email,password})
        if(data.success){
          // console.log("local storage successfully",data.token)
          localStorage.setItem("token", data.token)
          setToken(data.token)
          toast.success("Logged in successfully.")
        }else{
          toast.error(data.message)
        }
      }
      navigate('/')
    } catch (error) {
      toast.error(error.message); 
    }
  };

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">{state==='Sign up'?"Create Account":"Login"}</h2>
        <p className="text-center text-gray-600 mb-5">Please {state==='Sign up'?"Sign up":"login"} to book an appointment</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          {state==="Sign up" &&<div>
            <label htmlFor="fullName" className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
           {state==='Sign up'?"Create Account":"Login"}
          </button>
        </form>

        {/* Login Redirect */}
       {state==='Sign up'? <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            // onClick={() => navigate('/login')}
            onClick={()=>setState("login")}
          >
            Login here
          </span>
        </p>:<p className="text-center text-gray-600 mt-4">Create an new account?<span
            className="text-blue-500 cursor-pointer hover:underline"
            // onClick={() => navigate('/login')}
            onClick={()=>setState("Sign up")}
          >
            Click here
          </span></p>}
      </div>
    </div>
  );
};

export default CreateAccount;

