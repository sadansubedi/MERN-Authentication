import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken'

const verifyToken =(req,res,next)=>{
    const token = req.cookies.access_token;       //if user is signin then token is store in cookie that retrieve here ok 
   
    if(!token) return next(errorHandler(401,'Unauthorized'));

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{           //and here that token ,secret key and user are compare  and verify that same id was used to generate given token or not simply means user is singin or not  
        
        if(err) return next(errorHandler(403,'Forbidden'));
        console.log("user means => ",user)//Output is  user means =>  { id: '66cc6c880213ac0f8978492b', iat: 1724846695 } that means user contain id ok here iat = (issue at time) means when the token was issued.
        req.user = user;
        next();
    })
}
export {verifyToken}