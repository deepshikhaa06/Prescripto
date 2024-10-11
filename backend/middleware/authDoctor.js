import jwt from 'jsonwebtoken'

//*DOCTOR AUTHENTICATION MIDDLEWARE
const authDoctor = async (req, res,next) => {
    try {
        const {dtoken}=req.headers
        if (!dtoken) {
            return res.status(401).json({ success: false, message: 'No token provided.' })
        }
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
        req.body.docId=token_decode._id
        next()
    } catch (error) {
        console.error('Error in authDoctor middleware:', error.message)
        res.status(500).json(error.message)
    }
}

export default authDoctor