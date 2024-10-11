import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'

//*API TO REGISTER USER
const registerUser = async (req,res) => {
    try {
        const {name,email,password} = req.body
        if(!name ||!password ||!email) {
            return res.status(400).json({success: false, message:"Please enter all required fields"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message:"Invalid email format"})
        }
        if(password.length < 4){
            return res.status(400).json({success: false, message:"Password must be at least 4 characters long"})
        }
        //*HASHING USER PASSWORD
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password, salt);
        const userData={password:hashedPassword,name,email}
        //*CREATE NEW USER
        const newUser= new userModel(userData)
        const user=await newUser.save();

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success: true, message:"User registered successfully", token})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:error.message})
    }
}

//*API FOR USER LOGIN
const loginUser=async (req,res) => {
    try {
        const {email,password} = req.body
        if(!email ||!password) {
            return res.status(400).json({success: false, message:"Please enter all required fields"})
        }
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).json({success: false, message:"User not found"})
        }
        const match=await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(400).json({success: false, message:"Incorrect password"})
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        console.log("token by login user",token);
        res.json({success: true, message:"User logged in successfully", token})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:error.message})
    }
}

//*API TO GET USER PROFILE
    const getUserProfile=async (req,res) => {
    try {
        console.log("req body",req.body);
       const {userId}=req.body;
       if(!userId){
            return res.status(400).json({success: false, message:"User ID is required"})
       }
       const userData = await userModel.findById(userId).select('-password')
       if(!userData){
            return res.status(404).json({success: false, message:"User not found"})
       }
       res.json({success: true, message:"User profile fetched successfully", userData})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:error.message})
    }
}

//**API TO UPDATE USER PROFILE
    const updateUserProfile=async (req,res) => {
    try {
       const {userId,name,phone,address,dob,gender}=req.body;
       const imageFile=req.file
       if(!name||!phone||!dob||!gender){
        return res.status(400).json({success: false, message:"All required fields are missing"})
       }
       const userData=await userModel.findByIdAndUpdate(userId,{name,phone,address,dob,gender,address:JSON.parse(address)},{new:true,useFindAndModify: false})
       if(imageFile){
        //*upload image to cloudinary
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
        const imageUrl=imageUpload.secure_url
        //*update user profile picture
        await userModel.findByIdAndUpdate(userId,{image: imageUrl},{new: true,useFindAndModify: false})
       }
       res.json({success: true, message:"User profile updated successfully", userData})
    } catch (error){

    }
}

//**API TO BOOK APPOINTMENT
const bookAppointment = async (req, res) => {
    try {
        const {userId, docId,slotDate,slotTime}=req.body;
        const docData=await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.status(400).json({success: false, message:"Doctor is not available at this time"})
        }

        let slots_booked=docData.slots_booked
        //*CHECKING FOR SLOTS AVAILABLITY
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.status(400).json({success: false, message:"Slot already booked"})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }

        const userData=await userModel.findById(userId).select('-password')
        delete docData.slots_booked

        const appointmentData={
            userId,docId,userData,docData,amount:docData.fees,slotDate,slotTime,date:Date.now()
        }
        const newAppointment=new appointmentModel(appointmentData)
        await newAppointment.save()

        //*SAVE NEW SLOTS DATA IN DOCDATA
        await doctorModel.findByIdAndUpdate(docId,{slots_booked},{new: true,useFindAndModify: false})
        res.json({success:true,message:"Appointment Booked successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:error.message})
    }
}

//*API TO GET USER APPOINTments FOR FRONTEND MY-APPOINTEMENT PAGE
const listAppointment =async (req, res, next) => {
        try {
            const {userId}=req.body
            const appointments = await appointmentModel.find({userId})
            res.json({success: true, message: "Appointments fetched successfully", appointments})
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false, message: error.message})
        }
}

//*API TO CANCEL APPOINTMENT
const cancelAppointment=async (req, res) => {
    try {
        const {userId,appointmentId}=req.body
        const appointmentData= await appointmentModel.findById(appointmentId)
        //*VERFIY APPOINTMENT USER
        if(appointmentData.userId !==userId){
            return res.status(401).json({success: false, message:"Unauthorized to cancel this appointment"})
        }
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

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, //rzp_test_BLEJmDYYUhBK70
    key_secret: process.env.RAZORPAY_KEY_SECRET, //LbynL6e6cXSpqU0lfWoNjw2K
   // currency: 'INR'  //*Change currency according to your requirement. Default is INR
})
//*API TO MAKE PAYMENT OF APPOINTMENT USING RAZORPAY
const paymentRazorpay=async (req, res)=>{
    try {
        const {appointmentId} =req.body;
    const appointmentData= await appointmentModel.findById(appointmentId)
    if(!appointmentData || appointmentData.cancelled){
        return res.status(404).json({success: false, message: "Appointment not found"})
    }
    //*CREATING OPTIONS FOR RAZORPAY PAYMENT
    const options = {
        amount: appointmentData.amount * 100, //*Amount in paisa
        currency: 'INR',
        receipt: appointmentId,
    }
    //*CREATING OF AN ORDER
    const order=await razorpayInstance.orders.create(options)
    res.json({success: true, order})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})   
    }
}

//**API TO VERIFY PAYMENT OF RAZORPAY
const verifyRazorpay=async (req, res, next) => {
    try {
        const {razorpay_order_id} = req.body
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
        // console.log(orderInfo);
        if(orderInfo.status ==='paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment: true},{new: true,useFindAndModify: false})
            res.json({success: true, message: "Payment successful"})
        }else{
            res.status(400).json({success: false, message: "Payment failed"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message})
    }
}
export {registerUser,loginUser,getUserProfile,updateUserProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}