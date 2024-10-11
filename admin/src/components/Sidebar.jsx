import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const {dToken } = useContext(DoctorContext)

  return (
    <div className="bg-white min-h-screen shadow-md">
      {aToken && (
        <ul className="space-y-4">
          <li>
            <NavLink
              to={"/admin-dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer 
                ${
                  isActive
                    ? "bg-[#F2F3FF] border-r-4 border-primary text-purple-600"
                    : "text-gray-700 hover:bg-purple-50"
                }`
              }
              aria-current="page"
            >
              <img src={assets.home_icon} className="w-6 h-6" alt="Dashboard" />
              <p className="hidden md:block">Dashboard</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/all-appointments"}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer 
                ${
                  isActive
                    ? "bg-[#F2F3FF] border-r-4 border-primary text-purple-600"
                    : "text-gray-700 hover:bg-purple-50"
                }`
              }
            >
              <img
                src={assets.appointment_icon}
                className="w-6 h-6"
                alt="Appointments"
              />
              <p className="hidden md:block">Appointments</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/add-doctor"}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer 
                ${
                  isActive
                    ? "bg-[#F2F3FF] border-r-4 border-primary text-purple-600"
                    : "text-gray-700 hover:bg-purple-50"
                }`
              }
            >
              <img src={assets.add_icon} className="w-6 h-6" alt="Add Doctor" />
              <p className="hidden md:block">Add Doctor</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/doctor-list"}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer 
                ${
                  isActive
                    ? "bg-[#F2F3FF] border-r-4 border-primary text-purple-600"
                    : "text-gray-700 hover:bg-purple-50"
                }`
              }
            >
              <img
                src={assets.people_icon}
                className="w-6 h-6"
                alt="Doctors List"
              />
              <p className="hidden md:block">Doctors List</p>
            </NavLink>
          </li>
        </ul>
      )}
      {dToken && (
        <ul className="space-y-4">
          <li>
            <NavLink
              to={"/doctor-dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer 
                ${
                  isActive
                    ? "bg-[#F2F3FF] border-r-4 border-primary text-purple-600"
                    : "text-gray-700 hover:bg-purple-50"
                }`
              }
              aria-current="page"
            >
              <img src={assets.home_icon} className="w-6 h-6" alt="Dashboard" />
              <p className="hidden md:block">Dashboard</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/doctor-appointments"}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer 
                ${
                  isActive
                    ? "bg-[#F2F3FF] border-r-4 border-primary text-purple-600"
                    : "text-gray-700 hover:bg-purple-50"
                }`
              }
            >
              <img
                src={assets.appointment_icon}
                className="w-6 h-6"
                alt="Appointments"
              />
              <p className="hidden md:block">Appointments</p>
            </NavLink>
          </li>
          <li>
          </li>
          <li>
            <NavLink
              to={"/doctor-profile"}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer 
                ${
                  isActive
                    ? "bg-[#F2F3FF] border-r-4 border-primary text-purple-600"
                    : "text-gray-700 hover:bg-purple-50"
                }`
              }
            >
              <img
                src={assets.people_icon}
                className="w-6 h-6"
                alt="Doctors List"
              />
              <p className="hidden md:block">Profile</p>
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
