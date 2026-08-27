import User from "../models/users.js";
import bcrypt from "bcrypt";


const registerUser=async (req,res)=>{
    try{
        const {username,email,password,}=req.body;


        //check
        if(!username || !email ||!password  ){
            return res.status(400).json({
                message:"All filed are required"
            });
        }

        //check exixting user 
        const existingUser= await User.findOne({
            $or:[{email},{username}]
        });

        if(existingUser){
            return res.status(409).json({
                message:"User already exists"
            });
        }

        //hash password

        const hashedpassword =await bcrypt.hash(password,10);


        //create user

        const user =await User.create({
            username,
            email,
            password:hashedpassword,
            

        });

        return res.status(201).json({
            message:"User registered successfully",
            user:{
               id:user._id,
               username:user.username,
               email:user.email,
             
            }
        });

    }catch(error){
        console.error("🔥 REGISTER ERROR:", error);
        return res.status(500).json({
            message:"Registration faild",
            error:error.message
        });
    }

};

export {registerUser};




