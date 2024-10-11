import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Myprofile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );
      if (data.success) {
        setUserData(data.user);
        loadUserProfileData();
        setImage(false);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Simulate saving information
  const saveInformation = () => {
    console.log("Information saved:", userData);
    setIsEditing(false);
  };

  return userData && (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Profile Header */}
      <div className="flex items-center mb-6">
        {isEditing ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75 "
                src={image ? URL.createObjectURL(image) : userData.image}
              />
               {!image && (
                    <img
                      className="w-10 absolute bottom-12 right-12"
                      src={assets.upload_icon}
                      alt="Upload"
                    />
                  )}
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img
            src={userData?.image || assets.default_profile_image}
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
        )}
        <div className="ml-6">
          <h2 className="text-2xl font-semibold">{userData.name}</h2>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-600">CONTACT INFORMATION</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Email Id:</p>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
          ) : (
            <p className="text-indigo-600">{userData.email}</p>
          )}
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Phone:</p>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
          ) : (
            <p className="text-indigo-600">{userData.phone}</p>
          )}
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Address:</p>
          {isEditing ? (
            <div>
              <textarea
                name="line1"
                value={userData?.address?.line1 || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: { ...userData.address, line1: e.target.value },
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Address Line 1"
              />
              <textarea
                name="line2"
                value={userData?.address?.line2 || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: { ...userData.address, line2: e.target.value },
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Address Line 2"
              />
            </div>
          ) : (
            <div>
              <p className="text-indigo-600">
                {userData?.address?.line1 || "N/A"}
              </p>
              <p className="text-indigo-600">
                {userData?.address?.line2 || "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold text-gray-600">BASIC INFORMATION</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Gender:</p>
          {isEditing ? (
            <input
              type="text"
              name="gender"
              value={userData.gender}
              onChange={(e) =>
                setUserData({ ...userData, gender: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
          ) : (
            <p className="text-indigo-600">{userData.gender}</p>
          )}
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Birthday:</p>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={(e) =>
                setUserData({ ...userData, dob: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
          ) : (
            <p className="text-indigo-600">{userData.dob}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={toggleEdit}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button
            onClick={updateUserProfileData}
            className="px-4 py-2 border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-100"
          >
            Save information
          </button>
        )}
      </div>
    </div>
  );
};

export default Myprofile;
