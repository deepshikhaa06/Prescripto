import React, { useContext } from "react";
import { doctors } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate=useNavigate()
  const {doctors} = useContext(AppContext)
  return (
    <>
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
        <h1 className="text-3xl font-medium">Top Doctors To Book</h1>
        <p className="sm:w-1/3 text-center text-sm">
          Simply browsw throgh our extensive list of trusted Doctors
        </p>
        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0 ">
          {doctors.slice(0, 10).map((item, index) => (
            <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500" key={index}>
              <img src={item.image} className="bg-blue-50" />
              <div className="p-4">
                <div className={`${item.available ? 'text-green-500': 'text-gray-500'} flex items-center text-center text-sm gap-3`}>
                  <p className={`w-2 h-2 ${item.available ? 'bg-green-500': 'bg-gray-500'} rounded-full`}></p>{" "}
                  <p>{item.available?'Available':'Not Available'}</p>
                </div>
                <p className="font-medium text-gray-900 text-lg">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className="mt-10 rounded-full py-3 px-12 text-gray-600 bg-blue-100">more</button>
      </div>
    </>
  );
};

export default TopDoctors;
