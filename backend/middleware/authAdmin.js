import jwt from 'jsonwebtoken';

// Middleware for verifying admin token
const authAdmin = async (req, res,next) => {
    try {
        console.log("req.headers",req.headers);
        // const {aToken}=req.headers
        const token = req.headers['atoken'];  // 'atoken' is the lowercase version
        console.log("token", token);

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






//!Chatgpt for authorization token (syd yh khud hi bearer token leleta h headers m se)
// import jwt from 'jsonwebtoken';

// const authAdmin = async (req, res, next) => {
//   try {
//     // const token = req.headers['atoken']; // key from frontend
//     const authHeader = req.headers.authorization;

// if (!authHeader || !authHeader.startsWith("Bearer ")) {
//   return res.status(401).json({ success: false, message: "Token not provided or malformed" });
// }

// const token = authHeader.split(" ")[1]; // get token after "Bearer"

//     console.log("Received token:", token);

//     if (!token) {
//       return res.status(401).json({ success: false, message: "Token is not present" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // If you need to validate identity:
//     if (decoded.email !== process.env.ADMIN_EMAIL) {
//       return res.status(403).json({ success: false, message: "Not authorized" });
//     }

//     req.adminEmail = decoded.email; // you can use this in your controllers
//     next();
//   } catch (error) {
//     console.error("JWT verification error:", error);
//     res.status(403).json({ success: false, message: "JWT malformed or expired" });
//   }
// };

// export default authAdmin;
