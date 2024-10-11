// LiPN01KmQVovbyPS
// mongodb+srv://maheshwarideepshikha06:<db_password>@cluster0.7qah4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRouter.js';
import doctorRouter from './routes/doctorRouter.js';
import userRouter from './routes/userRouter.js';

//APP CONFIG
const app=express()
const PORT=process.env.PORT || 4000

//CONNECT TO DB
connectDB()
connectCloudinary()

//MIDDLEWARE
app.use(express.json())
// app.use(cors())
app.use(cors({ origin: '*' }));
//!API END POINTS
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)


//!ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to the API')
})

//LISTEN TO PORT

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))