import User from "../models/usermodel.js"
import bcryptjs  from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import  jwt from "jsonwebtoken";
const Signup =async(req,res,next)=>{
    const {username,email,password} = req.body;
    const hashpassword = bcryptjs.hashSync(password,10);

    const result = new User({
        username:username,
        email:email,
        password:hashpassword
    })
    try {
        const results = await result.save()
    // res.status(201).send(results)
    res.status(201).json({ message: "successfully created", data: results });
    console.log(results)
    } catch (error) {
        // res.status(500).json(error.message);

        //manual error handling using middleware
        next(error);
        // next(errorHandler(550,'error from the function'))//it is created to give manual error message
        
    }
    
}

const signin = async(req,res,next)=>{
    const {email,password} = req.body
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,"User not found!"));
        const validpassword = bcryptjs.compareSync(password,validUser.password);
        if(!validpassword) return next(errorHandler(401,"Wrong credentials"));
        const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET);
        const {password:pass , ...rest} = validUser._doc;//to return email username except password to frontend
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    } catch (error) {
        next(error);
    }

};

//Add Google OAuth functionality
const google = async(req,res,next)=>{
    try {
        const user = await User.findOne({email:req.body.email})

        //if user signin previosly then we have data of that user in DB but if not that means else then create new user and save it to database 
        if(user){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password:pass, ...rest} =user._doc ;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        } else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);

            const newUser = new User({ //here it get username :req.body.name ,email,avatar from body: JSON.stringify of OAuth.jsx ok 
                username:req.body.name.split("").join("").toLowerCase() + Math.random().toString(36).slice(-4) ,
                email:req.body.email,
                password:hashedPassword,
                avatar:req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:pass, ...rest} =newUser._doc ;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }
    } catch (error) {
        next(error)
    }
}

const signOut =async(req,res,next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error)
    }
}

export {Signup,signin,google,signOut}