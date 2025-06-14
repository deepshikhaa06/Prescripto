import { createContext, useState ,useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  // const [aToken, setAToken] = useState(
  //   localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  // );
  const [aToken, setAToken] = useState(() => localStorage.getItem("aToken") || "");

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Sync token to localStorage whenever it changes
useEffect(() => {
  localStorage.setItem("aToken", aToken);
}, [aToken]);


  const getAllDoctors = async () => {
    try {
      console.log("Sending token:", aToken);
      // const {data}=await axios.post(backendUrl+'api/admin/all-doctors',{},{headers:{aToken}})
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        // headers: { aToken },
        headers: { Authorization: `Bearer ${aToken}`,
  },
      });
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
        console.log("getalldoctors in if else", data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log("getalldoctors try and catch", error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        // { headers: { aToken } }
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
        console.log("changeavailability in if else", data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log("changeavailability try and catch", error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        // headers: { aToken },
         headers: { Authorization: `Bearer ${aToken}` } 

      });
      if (data.success) {
        setAppointments(data.appointments);
        // console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
        const { data } = await axios.post(
          backendUrl + "/api/admin/cancel-appointment",
          { appointmentId },
          // { headers: { aToken } }
              { headers: { Authorization: `Bearer ${aToken}` } }

        );
      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const getDashData = async () => {
    try {
        const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
          // headers: { aToken },
          headers: { Authorization: `Bearer ${aToken}` } 

        });
        if (data.success) {
          setDashData(data.dashData);
          console.log(data.dashData);
        } else {
          toast.error(data.message);
        }
    } catch (error) {
        console.error(error);
      toast.error(error.message);
    }
  }
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    getDashData,
    dashData
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
