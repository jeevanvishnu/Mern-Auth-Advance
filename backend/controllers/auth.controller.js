import { User } from "../models/user.model.js"
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

export const login = async (req , res) =>{
    res.send("login")
}

export const logout = async (req , res) =>{
    res.send("logout")
}