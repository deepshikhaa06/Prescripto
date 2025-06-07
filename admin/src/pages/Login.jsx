import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setAToken, backendUrl} = useContext(AdminContext)
  const {setDToken}=useContext(DoctorContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if(state==="Admin"){
            const {data}=await axios.post(backendUrl+'/api/admin/login', {email,password})
              console.log("Admin login response:", data); // 👈 add this
            if(data.success){
                console.log("Token received:",data.token);
                console.log(" aToken Token received:", data.aToken); // 👈 add this
                // localStorage.setItem('aToken',data.token)
                // setAToken(data.token)
                localStorage.setItem('aToken',data.aToken)
                setAToken(data.aToken)
                navigate("/admin/dashboard");
            }else{
                toast.error(data.message)
            }
        } 
        else{
          const {data}=await axios.post(backendUrl+'/api/doctor/login',{email,password})
          if(data.success){
            console.log("local storage successfully",data.token)
            localStorage.setItem("dToken", data.token)
            setDToken(data.token)
            // console.log(data.token);
            toast.success("Logged in successfully.")
          }else{
            toast.error(data.message)
            console.log(data.message);
          }
        }
    } catch (error) {
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <p className="text-2xl font-bold text-center mb-6">
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Email</p>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Password</p>
          <input
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600 transition duration-300">
          Login
        </button>

        <div className="mt-6 text-center">
          {state === "Admin" ? (
            <p className="text-gray-600">
              Doctor Login?{" "}
              <span
                className="text-primary cursor-pointer hover:underline"
                onClick={() => setState("Doctor")}
              >
                Click Here
              </span>
            </p>
          ) : (
            <p className="text-gray-600">
              Admin Login?{" "}
              <span
                className="text-primary cursor-pointer hover:underline"
                onClick={() => setState("Admin")}
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
