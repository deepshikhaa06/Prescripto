import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors,changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5 overflow-y-scroll max-h-[90vh]">
      <h2 className="text-lg font-medium ">All Doctors</h2>
      <div className="w-full flex flex-wrap pt-5 gap-y-6 gap-4">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="border border-[#C9D8FF] rounded-xl max-w-xs overflow-hidden cursor-pointer group"
            >
              <img
                className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500"
                src={doctor.image}
                alt={doctor.name}
              />
              <div className="p-4">
                <p className="text-[#262626] text-lg font-medium">
                  {doctor.name}
                </p>
                <p className="text-[#5C5C5C] text-sm">{doctor.speciality}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={doctor.available}
                    readOnly
                    onChange={(e) => changeAvailability(doctor._id, e.target.checked)}
                    className="text-primary"
                  />
                  <p>{doctor.available === 'true' ? 'Available' : 'Not Available'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No doctors available</p>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
