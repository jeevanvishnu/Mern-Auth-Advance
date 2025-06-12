import jwt from "jsonwebtoken"

export const generateTokenAndSetCookies = (res , userId) =>{

   const token = jwt.sign({userId},process.env.JWT_SECRECTKEY,{
      expiresIn:'30d'
   })

   res.cookie('token',token,{
      httpOnly:true,
      secure:process.env.NODE_ENV === "production",
      sameSite:'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
   })

   return token
}

