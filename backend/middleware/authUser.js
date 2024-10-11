import jwt from 'jsonwebtoken';

//*USER AUTHENTICATION MIDDLEWARE
const authUser=(req,res,next) => {
    try {
        // console.log("req.headers", req.headers);
        const {token} = req.headers
        // const token=req.headers.authorization?.split(" ")[1];
        // console.log("token", token);
        if(!token) {
            return res.status(401).json({ success: false, message: 'No token provided.' });
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        // console.log("token decode ",token_decode);
        req.body.userId=token_decode.id
        next()
        // try {
        //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //     req.user = decoded; // Attach user info to req object
        //     next();
        //   } catch (error) {
        //     res.status(401).json({ message: 'Token is not valid' });
        //   }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
    }
}

export default authUser;