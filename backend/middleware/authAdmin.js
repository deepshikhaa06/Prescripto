import jwt from 'jsonwebtoken';

// Middleware for verifying admin token
const authAdmin = async (req, res,next) => {
    try {
        // console.log(req.headers);
        // const {aToken}=req.headers
        const token = req.headers['atoken'];  // 'atoken' is the lowercase version
        // console.log("token", token);
        
        if(!token){
            return res.json({success:false, message:"Token is not present"})
        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET)
        if (token_decode !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ success: false, message: "Not Authorized, login again" });
        }
        next();
    } catch (error) {
        console.log(error)
        res.json({success: false,message: error.message})
    }
}

export default authAdmin;