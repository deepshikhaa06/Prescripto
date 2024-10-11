import validator from "validator";
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";


//?API FOR ADDING DOCTOR
const addDoctor =async (req, res) => {
    // Extract data from request body
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body;
        const imageFile = req.file
        // console.log("admin",{name,email,password,speciality,degree,experience,about,fees,address},imageFile);
        //*CHECK FOR ALL DATA TO AD DOCTOR
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({message:"Please enter all information",success:false});
        }
        //* VALIDATING EMAIL FORMAT
        if(!validator.isEmail(email)){
            return res.json({message:"Invalid email format",success:false});
        }
        if (!req.file) {
            return res.json({ message: "Image file is required", success: false });
        }
        
        //*VALIDATING STRONG PASSWORD
        if(password.length < 4){
            return res.json({message:"Password must be at least 4 characters long",success:false});
        }
        //*HASHING DOCTOR PASSWORD
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password, salt);
        //* UPLOAD IMAGE TO CLOUDING
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl= imageUpload.secure_url

        const doctorData={
            name,
            email,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            image: imageUrl,
            date:Date.now(),
        }

        const newDoctor= new doctorModel(doctorData)
        await newDoctor.save()
        res.json({success:true,message:"Doctor saved"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//?API FOR ADMIN LOGIN
const loginAdmin =async (req, res) => {
    try {
        const {email, password}=req.body
        //*CHECK IF ADMIN EXISTS
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true,message:"Admin logged in",aToken:token})
        }else{
            return res.json({message:"Invalid credentials",success:false})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//?API FOR GETTING ALL DOCTORS
const allDoctors=async (req, res) => {
    try {
        const doctors=await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        console.log("allDoctors",error);
        res.json({success:false,message:error.message})
    }
}

//?API TO GET ALL APPOINTMENTS LIST
const appointmentsAdmin=async(req,res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,message:"Appointments fetched successfully", appointments})
    } catch (error) {
        console.log("appointmentsAdmin",error);
        res.json({success:false,message:error.message});
    }
}
//?API FOR APPOINTMENT CANCELLATION
const Appointmentcancel=async (req, res) => {
    try {
        const {appointmentId}=req.body
        const appointmentData= await appointmentModel.findById(appointmentId)
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
        //*RELEASING DOCTOR SLOT
        const {docId,slotDate,slotTime}=appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked =doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e =>e!==slotTime);
        await doctorModel.findByIdAndUpdate(docId,{slots_booked},{new: true,useFindAndModify: false})
        res.json({success: true, message:"Appointment cancelled successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
}

//?API TO GET DASHBOARD DATA FOR ADMIN PANEL
const adminDashboard =async (req,res)=>{
    try {
        const doctors=await doctorModel.find({})
        const appointments=await appointmentModel.find({})
        const users=await userModel.find({})

        const dashData ={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointment: appointments.reverse().slice(0,5)
        }
        res.json({success:true, message:"Dashboard data fetched successfully",dashData})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
}
export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,Appointmentcancel,adminDashboard}