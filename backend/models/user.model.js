import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    email:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    lastLogin:{
        type:Date,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExperiedAt:Date,
    verificationToken:String,
    verificationTokenExperiedAt:Date


},{timestamps:true})