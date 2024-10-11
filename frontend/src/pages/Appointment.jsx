import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const navigate = useNavigate();
  const { docId } = useParams(); // Get docId from route params
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null); // State to store the selected doctor's information
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const daysofWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Function to fetch the doctor's info based on docId
  const fetchDocInfo = () => {
    const doc = doctors.find((d) => d._id === docId); // Find the doctor by _id
    setDocInfo(doc); // Set the doctor info in state
  };

  // Function to generate available slots
  const generateSlots = () => {
    let today = new Date();
    let slots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endDate = new Date();
      endDate.setHours(21, 0, 0, 0);
      endDate.setDate(today.getDate() + i);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endDate) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

       let day=currentDate.getDate();
       let month=currentDate.getMonth()+1;
       let year=currentDate.getFullYear();
       const slotDate=day+"_"+ month+"_"+year
       const slotTime = formattedTime

       const isSlotAvailable = docInfo.slots_booked[slotDate] &&  docInfo.slots_booked[slotDate].includes(slotTime)?false:true
       if(isSlotAvailable){
        //*ADD SLOT TO ARRAY
        timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
       }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      slots.push(timeSlots);
    }

    setDocSlots(slots); // Set the generated slots in the state
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("login to book appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDay();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;
    //   console.log(slotDate);
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: {token} }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
        console.log("error while booking appointment", data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while booking appointment");
    }
  };
  // Fetch doctor info whenever docId changes
  useEffect(() => {
    if (docId && doctors) {
      fetchDocInfo();
    }
  }, [docId, doctors]);

  // Generate available slots only once when docInfo is set
  useEffect(() => {
    if (docInfo) {
      generateSlots();
    }
  }, [docInfo]);

  // Loading state if docInfo is not yet available
  if (!docInfo) {
    return <p>Loading doctor information...</p>;
  }

  return (
    <div>
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            src={docInfo.image}
            alt={docInfo.name}
            className="w-full bg-primary sm:max-w-72 rounded-lg"
          />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <h1 className="text-2xl font-bold flex gap-1">
            {docInfo.name}
            <img src={assets.verified_icon} alt="Verified" />
          </h1>
          <p className="text-gray-500">
            {docInfo.degree} - {docInfo.speciality}
          </p>
          <p className="text-xs rounded-full text-gray-500 py-0.5 px-2 border">
            Experience: {docInfo.experience}
          </p>
          <p className="mt-2 text-gray-600 flex gap-2">
            About <img src={assets.info_icon} alt="Info" />
          </p>
          <p className="mt-2 text-gray-600 text-sm">{docInfo.about}</p>
          <p className="text-lg mt-4 font-semibold">
            Appointment Fee: {currencySymbol}
            {docInfo.fees}
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <h2>Booking Slots</h2>
        <div className="mt-4 flex gap-3 items-center w-full overflow-x-scroll">
          {docSlots.length &&
            docSlots.map((item, i) => (
              <div
                key={i}
                onClick={() => setSlotIndex(i)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === i
                    ? "bg-primary text-white "
                    : "border border-gray-200"
                }`}
              >
                <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>
        <div className="flex items-center overflow-x-scroll w-full">
          {docSlots.length &&
            docSlots[slotIndex].map((item, i) => {
              return (
                <div
                  key={i}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-center flex-shrink-0 py-3 px-6 border-b rounded-full border-gray-200 cursor-pointer ${
                    slotTime === item.time ? "bg-primary text-white" : ""
                  }`}
                >
                  <p>{item.time}</p>
                </div>
              );
            })}
        </div>
        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
        >
          Book a Appointment
        </button>
      </div>
      {/*listing Related doctos */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
