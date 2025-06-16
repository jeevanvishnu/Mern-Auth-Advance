import { User } from "../models/user.model.js"
import { sendVerificationEmail , sendWelcomeEmail , sendPasswordResetEmail , sendResendSucessEmail} from "../mailtrap/emails.js"
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js"
import bcrypt from "bcryptjs"
import cyprto from "crypto"




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
    const {email , password} = req.body
    console.log(email)
    try {

        const user = await User.findOne({email})
        if(!user) return res.status(400).json({success:false , message:"Invalid creditional"})
        
            const isValidPassword = await bcrypt.compare(password , user.password)
            if(!isValidPassword) return res.status(400).json({success:false , message:"Invaild Password"})

                generateTokenAndSetCookies(res , user._id)

                user.lastLogin = Date.now()
                await user.save()

                res.status(200).json({success:true ,
                    message:"User Login Sucessfully",
                    user:{
                        ...user._doc,
                        password:undefined
                    }
                })
        
    } catch (error) {
        console.log(error.nessage);
        res.status(500).json({success:false , message:error.message})
    }
    res.send("login")
}

export const forgotEmail =  async(req , res) =>{
    const {email} = req.body
    try {

        const user = await User.findOne({email})
        if(!user) return res.status(400).json({success:false , message:"User is not found"})

            const resetToken = cyprto.randomBytes(20).toString("hex")
            console.log(resetToken);

            const resetTokenExperied = Date.now() + 1 * 60 * 60 * 1000
            console.log(resetTokenExperied);
            
            user.resetPasswordToken = resetToken,
            user.resetPasswordExperiedAt = resetTokenExperied

            await sendPasswordResetEmail(user.email ,`${process.env.CLIENT_URL}/reset-password/${resetToken}` )

            user.save()

            res.status(200).json({success:true , message:"Password reset link send your email"})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false , message:"Internal server error"})
        
    }
}

export const reserPassword = async (req , res) =>{
    const {token} = req.params
    const {password} = req.body
    console.log(typeof token)
    try {
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExperiedAt:{$gt:Date.now()}
        })
        
  
        if(!user) return res.status(400).json({success:false,
            message:"Invaild or expired token"
        })

        const hashedPassword = await bcrypt.hash(password,10)
        user.password = hashedPassword;
        user.resetPasswordToken=undefined;
        user.resetPasswordExperiedAt = undefined
        await user.save()

        await sendResendSucessEmail(user.email)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({status:false , message:error.message})
    }
}

export const logout = async (req , res) =>{
    res.clearCookie('token');
    res.status(200).json({success:true , message:"Logout sucessfully"})
}