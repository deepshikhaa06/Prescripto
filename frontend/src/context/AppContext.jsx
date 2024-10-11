import { createContext, useState, useEffect } from "react";
import { doctors } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token")?localStorage.getItem("token") : false);
  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch doctors data");
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        // headers: {  Authorization: `Bearer ${token}` },
        headers: { token },
        // headers: { token: localStorage.getItem("token") }
      });
    //   console.log("Token:", token);
      if (data.success) {
        // console.log("User Profile Data: ",data.userData)
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch user profile data");
    }
  };

  const value = {
    doctors,getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    loadUserProfileData,
    setUserData,
    userData,
  };
  // console.log("AppContextProvider for Value: " + JSON.stringify(value));

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
