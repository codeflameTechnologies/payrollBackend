import express from "express";
import { registerAdmin, loginAdmin, verifyOtp, resetPassword, sendForgotLink } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", registerAdmin);
router.post("/verify-otp",verifyOtp);
router.post("/login", loginAdmin);
router.post("/reset-password",resetPassword)
router.post("/send-forgot-link",sendForgotLink);

export default router;