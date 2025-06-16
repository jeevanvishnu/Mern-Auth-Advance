import express from "express"
import { signup , login , logout , verifyEmail, forgotEmail , reserPassword} from "../controllers/auth.controller.js"

const router = express.Router()

router.post('/signup',signup)
router.post('/verify-email',verifyEmail)
router.post('/forgot-email',forgotEmail)
router.post('/reset-password/:token',reserPassword)
router.post('/login',login)
router.post('/logout',logout)

export default router