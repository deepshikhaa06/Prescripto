import React, { useContext, useEffect, useState} from "react";

import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointment = () => {
  const navigate = useNavigate();
  const { backendUrl, token,getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec",];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + "" + months[Number(dateArray[1])] + "" + dateArray[2];
  };
  const getUserAppointments = async (req, res) => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        // console.log(data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.message);
    }
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      // console.log(appointmentId);
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options={
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      order_id: order.id,
      description: "Appointment Payment",
      receipt: order.receipt,
      handler: async (response)=>{
        // console.log(response);
        try {
          const {data} = await axios.post(backendUrl+'/api/user/verifyRazorpay',{response},{headers: {token}})
          if(data.success){
            getUserAppointments();
            navigate('/my-appointments')
          }
        } catch (error) {
          console.error("Error while making payment:", error);
          toast.error(error.message);
        }
      }
    }
    const rzp=new window.Razorpay(options)
  rzp.open()
  }
  
  const appointmentRazorpay=async(appointmentId) => {
    try {
      const {data} = await axios.post(backendUrl +'/api/user/payment-razorpay',{appointmentId},{headers:{token}})
      if(data.success){
        // console.log(data.order);
        initPay(data.order)
        
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error while booking appointment:", error);
      toast.error(error.message)
    }
  }
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">My Appointments</h1>

      <div className="space-y-4">
        {appointments.map((doctor, index) => {
          return (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-gray-200 pb-4"
            >
              {/* Doctor Image */}
              <img
                src={doctor.docData.image}
                alt={doctor.docData.name}
                className="w-24 h-24 rounded-full object-cover"
              />

              {/* Doctor Details */}
              <div className="flex-1">
                <h2 className="font-bold text-lg">{doctor.docData.name}</h2>
                <p className="text-sm text-gray-600">
                  {doctor.docData.speciality}
                </p>

                {/* Doctor Address */}
                <p className="text-sm text-gray-600 mt-2">Address:</p>
                <p className="text-sm text-gray-600">
                  {doctor?.docData?.address?.line1}
                </p>
                <p className="text-sm text-gray-600">
                  {doctor?.docData?.address?.line2}
                </p>

                {/* Date & Time */}
                <p className="text-sm text-gray-600 mt-2">
                  Date & Time: {slotDateFormat(doctor.slotDate)} |
                  {doctor.slotTime}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="text-right">
                <>
                {!doctor.cancelled && doctor.payment && !doctor.isCompleted &&<button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-300">Paid</button>}
                  {!doctor.cancelled && !doctor.payment && !doctor.isCompleted && (
                    <button onClick={()=>{appointmentRazorpay(doctor._id)}} className="bg-blue-500 text-white px-4 py-2 rounded-full mb-2">
                      Pay here
                    </button>
                  )}
                  <br />
                  {!doctor.cancelled && !doctor.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(doctor._id)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full"
                    >
                      Cancel appointment
                    </button>
                  )}
                  {doctor.cancelled && !doctor.isCompleted && <button className=" sm:min-w-48 py-2 border border-red-500 rounded text-red-500 ">Appointment Cancelled</button>}
                  {doctor.isCompleted && <button className="sm:min-w-8 py-2 border border-green-500 rounded text-green-500">Completed</button>}
                </>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointment;
