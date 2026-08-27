import { Activity } from "react";
import User from "../models/users.js";

const getAllActivity =async(req ,res)=>{
    try{
        const {userId}=req.query;

        if(!userId){
            return res.status(400).json({
                message:"User Id is required"
            });

            const user=await User.findById(userId).select("activity");
            if(!user){
                return res.status(404).json({
                    message:"User note found"
                });
            }
            return res.status(200).json({
                message:"activity fetched successfully",
                activity:user.activity
            });
        }
    }catch(error){
        return res.status(500).json({
            message:"faild to fetch activity",
            error:error.message
        });
    }
};

export {getAllActivity};