import express from "express";
import { registerAdmin, loginAdmin, verifyOtp, resetPassword, sendForgotLink } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", registerAdmin);
router.post("/verify-otp",verifyOtp);
router.post("/login", loginAdmin);
router.put("/reset-password",resetPassword)
router.post("/send-forgot-link/:email",sendForgotLink);

export default router;