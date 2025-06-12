import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import authRouter from './router/auth.route.js'

const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api/auth',authRouter)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`The Port has running on ${PORT}`);
        
    })
})
