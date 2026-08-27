import User from "../models/users.js";
import bcrypt from"bcrypt";

const loginuser=async (req,res)=>{
    try{
        const {email,password}=req.body;

          if( !email ||!password  ){
            return res.status(400).json({
                message:"Email and password are required"
            });
        }
        //find
        const user=await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message:"User note found"
            });
        }
           //check paassword
        const ispasswordCorrect =await bcrypt.compare(
            password,
            user.password
        );

        if(!ispasswordCorrect){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }

        //llogin
        return res.status(200).json({
            message:"Login successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                
            }
        });


    }catch(error){
         console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            message:"Login faild",
            error:error.message
        });
    }
};

export {loginuser};