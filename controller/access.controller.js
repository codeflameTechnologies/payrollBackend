import jwt from 'jsonwebtoken';
import Access from '../model/Access.js';
import { sendEmail } from '../utils/sendEmail.js';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const normalizeEmail = (email) => email?.trim().toLowerCase();

export const createAccess = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const email = normalizeEmail(req.body.email);

    if (!adminId || !email) {
      return res.status(400).json({ success: false, message: 'Admin ID and email are required.' });
    }

    const existingAccess = await Access.findOne({ email });
    if (existingAccess) {
      return res.status(409).json({ success: false, message: 'Access for this email already exists.' });
    }

    const access = await Access.create({ admin_id: adminId, email });

    return res.status(201).json({
      success: true,
      message: 'Access created successfully.',
      data: access,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAccess = async (req, res) => {
  try {
    const adminId = req.user?.id || req.query.admin_id;
    const filter = adminId ? { admin_id: adminId } : {};

    const accessList = await Access.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: accessList.length, data: accessList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAccessById = async (req, res) => {
  try {
    const access = await Access.findById(req.params.id);

    if (!access) {
      return res.status(404).json({ success: false, message: 'Access not found.' });
    }

    return res.status(200).json({ success: true, data: access });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAccess = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const existingAccess = await Access.findOne({ email: normalizedEmail, _id: { $ne: req.params.id } });
    if (existingAccess) {
      return res.status(409).json({ success: false, message: 'This email is already in use.' });
    }

    const updatedAccess = await Access.findByIdAndUpdate(
      req.params.id,
      { email: normalizedEmail },
      { new: true }
    );

    if (!updatedAccess) {
      return res.status(404).json({ success: false, message: 'Access not found.' });
    }

    return res.status(200).json({ success: true, message: 'Access updated successfully.', data: updatedAccess });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAccess = async (req, res) => {
  try {
    const deletedAccess = await Access.findByIdAndDelete(req.params.id);

    if (!deletedAccess) {
      return res.status(404).json({ success: false, message: 'Access not found.' });
    }

    return res.status(200).json({ success: true, message: 'Access deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestMemberLoginOtp = async (req, res) => {
  console.log("start member login")
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const access = await Access.findOne({ email });
    if (!access) {
      return res.status(404).json({ success: false, message: 'No member access found for this email.' });
    }

    const otp = generateOtp();
    access.otp = otp;
    access.otpExpires = Date.now() + 5 * 60 * 1000;
    await access.save();

    await sendEmail(
      access.email,
      'Your Payroll Member Login OTP',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2563eb;">Payroll Member Login</h2>
        <p>Your OTP for signing in is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 20px 0;">${otp}</div>
        <p>This code is valid for 5 minutes.</p>
      </div>
      `
    );

    return res.status(200).json({ success: true, message: 'OTP sent successfully to your email.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyMemberLoginOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const access = await Access.findOne({ email });
    if (!access) {
      return res.status(404).json({ success: false, message: 'No member access found for this email.' });
    }

    if (!access.otp || access.otp !== otp || !access.otpExpires || Date.now() > access.otpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    access.otp = undefined;
    access.otpExpires = undefined;
    await access.save();

    const token = jwt.sign(
      {
        id: access._id,
        email: access.email,
        role: 'MEMBER',
        admin_id: access.admin_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Member logged in successfully.',
      token,
      data: {
        id: access._id,
        email: access.email,
        admin_id: access.admin_id,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
