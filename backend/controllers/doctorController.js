import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'

const changeAvailablity=async (req,res)=>{
    try{
       const {docId}=req.body
       const docdata=await doctorModel.findById(docId)
       await doctorModel.findByIdAndUpdate(docId,{available:!docdata.available})
       res.status(200).json({success: true,message: "Availability changed"})
    }catch(err){
        console.log(err)
        res.status(500).json({success: false,message:error.message})
    }
 
}

const doctorList = async(req,res)=>{
    try{
        const doctors=await doctorModel.find({}).select(['-password', '-email'])
        res.json({success: true,doctors})
    }catch(err){
        console.log("doctorList",err);
        res.json({success: false,message:err.message});
    }
}

//?API FOR DOCTOR LOGIN
const loginDoctor=async (req, res, next) =>{
    try {
        const {email,password} =req.body
        const doctor =await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false, message:"Email not found"})
        }
        const match = await bcrypt.compare(password, doctor.password)
        if(!match){
            return res.json({success: false, message:"Incorrect password"})
        }
        const token = jwt.sign({_id: doctor._id}, process.env.JWT_SECRET)
        res.json({success: true, message:"Doctor logged in successfully", token})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

//?API TO GET DOCTOR APPOINTMENTS FOR DOCTOR PANEL
const appointmentsDoctor = async (req, res) => {
    try {
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})
        res.json({success: true, message: "Appointments fetched successfully", appointments})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
}

//?API TO MARK APPOINTMENT COMPLETED FOR DOCTOR PANEL
const appointmentComplete=async (req,res)=>{
    try {
        const {docId,appointmentId} = req.body
        const appointmentData= await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId ===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted : true})
            return res.status(200).json({success: true,message: "appointment Cancelled"})
        }else{
            return res.status(401).json({success: false, message: "Marked falid"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message: error.message});
    }
}

//?API TO MARK APPOINTMENT CANCELLED FOR DOCTOR PANEL
const appointmentCancel=async (req,res)=>{
    try {
        const {docId,appointmentId} = req.body
        const appointmentData= await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId ===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled : true})
            return res.status(200).json({success: true,message: "appointment Cancelled"})
        }else{
            return res.status(401).json({success: false, message: " Cancellation falid"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message: error.message});
    }
}

//?API TO GET DASHBOARD DATA FOR DOCTOR PANEL
const doctorDashboard = async (req,res)=>{
    try {
        const {docId} =req.body;
        const appointments=await appointmentModel.find({docId})
        let earnings =0
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings+=item.amount
            }
        })
        let patients =[]
        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })
        const dashData={earnings, patients: patients.length,appointments:appointments.length,latestAppointments:appointments.reverse().slice(0,5)}
        res.json({success: true, message:"Dashboard data fetched successfully",dashData})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
}

//?API TO GET DOCTOR PROFILE FOR DOCTOR PANEL
const doctorProfile = async (req, res) => {
    try {
        const {docId}=req.body
        if(!docId){
            return res.status(400).json({success: false, message:"Doctor ID is required"})
        }
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({success:true,profileData})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message:error.message })
    }
}

//?API TO UPDATE DOCTOR PROFILE FOR DOCTOR PANEL
const updateDoctorProfile = async (req, res) => {
    try {
        const {docId, fees,address,available} = req.body
        await doctorModel.findByIdAndUpdate(docId,fees,address,available)
        res.json({success: true, message: "Profile updated successfully"})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {changeAvailablity,doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,updateDoctorProfile}