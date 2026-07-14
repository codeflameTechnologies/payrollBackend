import mongoose from "mongoose";
import bcrypt from "bcrypt"
import crypto from "crypto";
import { encrypt } from "../utils/encryption.js";

const admin = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    organization_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },

    otp: { type: String },
    otpExpires: { type: Date },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
    password: {
        type: String,
        required: true,
    }

})

admin.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// admin.methods.comparePassword = async function (cleintPassword) {
//     return await bcrypt.compare(cleintPassword, this.password)
// }


// Generate Reset Token
admin.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetToken = resetToken;
    this.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    return resetToken;
};


const userModel = mongoose.model("admin", admin)
export default userModel;