import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, getProfileData, profileData ,setProfileData,backendUrl} = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit,setIsEdit]=useState(false)

  const updateProfile =async ()=>{
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      }
      const {data} = await axios.post(backendUrl +'/api/doctor/update-profile', updateData,{headers:{dToken}})
      if (data.success) {
        toast.success("Profile updated successfully.");
        setProfileData(data.doctor);
        setIsEdit(false);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile.");
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return profileData &&  (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-4 md:mb-0">
          <img src={profileData.image} alt="Doctor profile" className="w-full h-auto rounded-lg object-cover" />
        </div>
        <div className="md:w-2/3 ml-0 md:ml-6 space-y-4">
          {/* Doctor Info: name, degree, experience */}
          <p className="text-2xl font-semibold text-gray-800">{profileData.name}</p>
          <div>
            <p className="text-lg text-gray-700">{profileData.degree} - {profileData.speciality}</p>
            <p className="text-sm text-gray-500">Experience: {profileData.experience}</p>
          </div>

          {/* Doctor About */}
          <div>
            <p className="text-gray-600">{profileData.about}</p>
          </div>

          {/* Appointment Fee */}
          <p className="text-xl font-bold text-gray-900">
            Appointment Fee: <span>{currency}
            {isEdit ? <input type='number' onChange={(e)=>setProfileData(prev => ({...prev,fees:e.target.value}))} value={profileData.fees}/>:profileData.fees}
          </span>
          </p>

          {/* Address */}
          <div className="space-y-1">
            <p className="font-semibold text-gray-800">Address:</p>
            {isEdit ? (
    <input
      type="text"
      onChange={(e) =>
        setProfileData((prev) => ({
          ...prev,
          address: { ...prev.address, line1: e.target.value },
        }))
      }
      value={profileData.address.line1}
      className="text-gray-600 border rounded p-1"
    />
  ) : (
    <p className="text-gray-600">{profileData.address.line1}</p>
  )}

  {/* Line 2 */}
  {isEdit ? (
    <input
      type="text"
      onChange={(e) =>
        setProfileData((prev) => ({
          ...prev,
          address: { ...prev.address, line2: e.target.value },
        }))
      }
      value={profileData.address.line2}
      className="text-gray-600 border rounded p-1"
    />
  ) : (
    <p className="text-gray-600">{profileData.address.line2}</p>
  )}          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <input onChange={()=>isEdit && setProfileData(prev => ({...prev,available:!prev.available}))} checked={profileData.available} type="checkbox" id="available" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="available" className="text-gray-700">Available</label>
          </div>

          {/* Edit Button */}
          {
            isEdit ? <button onClick={updateProfile} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
            Save
          </button>
          :<button onClick={()=>setIsEdit(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
          Edit
        </button>
          }
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
