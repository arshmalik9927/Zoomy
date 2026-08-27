import mongoose from "mongoose";

const meetingSchema= new mongoose.Schema(
    {
        meetingCode:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },

        host:{
            type:String,
            required:true,

        },

        participants:[
            {
                type:String,

            }
        ],

        startTime:{
            type:Date,
            default:Date.now
        },


        endTime:{
           type:Date
        },


        status:{
            type:String,
            enm:["scheduled","ongoing","ended"],
            default:"scheduled"
        },

    },
    {
        timestamps:true
    }
);

const Meeting=mongoose.model("Meeting",meetingSchema);

export default Meeting;