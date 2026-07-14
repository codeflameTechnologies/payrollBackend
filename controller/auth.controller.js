import userModel from '../model/admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

import { config } from "dotenv"
config();

// Register admin
export const registerAdmin = async (req, res) => {
  try {

    const { name, organization_name, email, phone, password } = req.body;
    console.log(req.body)
    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    // Create new admin
    const admin = new userModel({ name, organization_name, email, phone, password });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await userModel.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("password match", isMatch)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await admin.save();
    sendEmail(
      admin.email,
      "Your Codeflame Payroll ERP OTP Code",
      `
  <div style="
    font-family: 'Segoe UI', Tahoma, sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 30px;
    background: #f7f9fc;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  ">
    
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2563eb; margin: 0; font-size: 28px;">
        Codeflame Institute ERP
      </h2>
      <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">
        Your Secure Login OTP
      </p>
    </div>

    <div style="
      background: #ffffff; 
      padding: 25px; 
      border-radius: 10px; 
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      text-align: center;
    ">
      <h3 style="color: #111827; margin-top: 0; font-size: 20px;">
        Your One-Time Password (OTP)
      </h3>

      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        Use the OTP code below to complete your login to your Codeflame Institute ERP admin account.
      </p>

      <!-- OTP BOX -->
      <div style="
       
        color: #201d1dff;
        padding: 15px 25px;
        font-size: 30px;
        font-weight: bold;
        letter-spacing: 6px;
        border-radius: 10px;
        display: inline-block;
        margin: 25px 0;
      ">
        ${otp}
      </div>

      <p style="color: #374151; font-size: 14px;">
        This OTP is valid for only <strong>5 minutes</strong>.
      </p>

      <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
        If you did not request this OTP, please secure your account immediately.
      </p>
    </div>

    <div style="text-align: center; margin-top: 25px; color: #9ca3af; font-size: 12px;">
      © ${new Date().getFullYear()} Codeflame Technology • All rights reserved.
    </div>
  </div>
  `
    );

    res.status(200).json({ message: 'OTP sent to email' });


  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

export const sendForgotLink = async (req, res) => {
  const { email } = req.params;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const admin = await userModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'User not found. Please create your account' });
    }
    const resetToken = admin.generateResetToken();
    await admin.save();

    sendEmail(
      admin.email,
      "Password Reset Request – Codeflame Institute ERP",
      `
  <div style="
    font-family: 'Segoe UI', Tahoma, sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 30px;
    background: #f7f9fc;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  ">
    
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2563eb; margin: 0; font-size: 28px;">
        Codeflame Institute ERP
      </h2>
      <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">
        Secure Reset Password Request
      </p>
    </div>

    <div style="
      background: #ffffff; 
      padding: 25px; 
      border-radius: 10px; 
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    ">
      <h3 style="color: #111827; margin-top: 0;">Reset Your Password</h3>

      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        A request to reset your password has been received for your Codeflame Institute ERP admin account.
        If this was you, click the secure button below to reset your password.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/reset/password/${resetToken}"
          style="
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 8px;
            display: inline-block;
          ">
          Reset Password
        </a>
      </div>

      <p style="color: #374151; font-size: 14px;">
        Or copy and paste this link into your browser:
      </p>

      <p style="
        word-break: break-all; 
        background: #f3f4f6; 
        padding: 10px; 
        border-radius: 6px; 
        font-size: 13px; 
        color: #111827;
      ">
        ${process.env.FRONTEND_URL}/reset/password/${resetToken}
      </p>

      <p style="color: #374151; font-size: 14px; margin-top: 20px;">
        This link is valid for only <strong>15 minutes</strong>.
      </p>

      <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
        If you did not request a password reset, you can safely ignore this message.  
        Your account remains secure.
      </p>
    </div>

    <div style="text-align: center; margin-top: 25px; color: #9ca3af; font-size: 12px;">
      © ${new Date().getFullYear()} Codeflame Payroll ERP • All rights reserved.
    </div>
  </div>
  `
    );


    return res.status(200).json({
      message: "Password reset link has been sent to your email."
    });

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }

}


export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const admin = await userModel.findOne({ resetToken, resetTokenExpires: { $gt: Date.now() } })
    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    admin.password = newPassword;
    admin.resetToken = undefined;
    admin.resetTokenExpires = undefined;
    await admin.save()

    return res.status(200).json({ message: "Password updated successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await userModel.findOne({ email });
    if (!admin) return res.status(404).json({ message: "User not found" });

    if (admin.otp !== otp || Date.now() > admin.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP fields
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, name: admin.name, role: "ADMIN", organization_name: admin.organization_name, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({ token, admin: { name: admin.name, email: admin.email, phone: admin.phone } });
  } catch (err) {
    console.log(erro)
    res.status(500).json({ message: err.message });
  }
};


// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await userModel.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const updates = req.body;
    const admin = await userModel.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



