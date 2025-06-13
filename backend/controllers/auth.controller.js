import { User } from "../models/user.model.js"
import { sendVerificationEmail , sendWelcomeEmail } from "../mailtrap/emails.js"
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js"
import bcrypt from "bcryptjs"

export const signup = async (req , res) =>{
    const {email , name , password} = req.body
   try {
     if(!email || !name || !password){
        throw new Error("All Field is required")
     }
     const userAlreadyExists = await User.findOne({email})
     if(userAlreadyExists) return res.status(400).json({success:false,message:"User Already Exists"})
    
        const hashedPassword = await bcrypt.hash(password , 10)
        const verificationToken =  Math.floor(100000 + Math.random() * 900000).toString()
        const user = new User ({
            email,
            name,
            password:hashedPassword,
            verificationToken,
            verificationTokenExperiedAt:Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save()

        // jwt
        generateTokenAndSetCookies(res , user._id)

        await sendVerificationEmail(user.email,verificationToken)

        res.status(201).json({success:true ,
         message:"User Created Sucessfully",
        user:{
            ...user._doc,
            password:null
        }
        })
        
   } catch (error) {
     res.status(500).json({success:false,message:error.message})
   }
}


export const verifyEmail = async (req , res) =>{
    const {code} = req.body
    try{
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExperiedAt:{$gt:Date.now()}
        })

        if(!user) return res.status(400).json({success:false , message:"Invalied or Expried Token"})

            user.isVerified = true
            user.verificationToken = undefined;
            user.verificationTokenExperiedAt = undefined
            await user.save()
            await sendWelcomeEmail(user.email , user.name)
            res.status(200).json({success:true , 
            message:"User Verified Sucessfully",
            user:{
                ...user._doc,
                password:null
            }
            })

    }catch(error){
        console.log(error.message);
        res.status(500).json({success:false , message:"Internal Server Error"})
    }
}



export const login = async (req , res) =>{
    res.send("login")
}

export const logout = async (req , res) =>{
    res.send("logout")
}