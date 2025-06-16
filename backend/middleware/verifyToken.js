import jwt from "jsonwebtoken"

export const verifyToken = (req,res,next) =>{

    const token = req.cookies.token
    if(!token) return resizeBy.status(400).json({success:false,message:"Unauthorized- no token provide"})

        try {
            const decoded = jwt.verify(token ,process.env.JWT_SECRECTKEY)
            if(!decoded) return res.status(400).json({success:false , message:"Unauthorized- no token provide"})
                req.userId = decoded.userId
              next()
        } catch (error) {
            console.log(error.message);
            res.status(500).json({success:false, message:message.error})
            
        }
    }
