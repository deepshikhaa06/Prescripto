import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async()=>{
    try {
        // mongoose.connection.on('connection',()=>console.log("Connecting to MongoDB"))
        console.log("Connecting to MongoDB..."); 
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log("Connected to MongoDB");
    } catch (error) {
        // Log connection error
        console.error("Error connecting to MongoDB:", error.message);
    }
}

export default connectDB;