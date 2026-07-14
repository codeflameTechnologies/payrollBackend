import adminModel from "../model/admin.js";

export const adminVerify = async (req, res, next) => {
  try {
    const { id } = req.user;

    const admin = await adminModel.findById(id);

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin not found.",
      });
    }

    req.admin = admin; // Optional: aage ke controllers me use kar sakte ho

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};