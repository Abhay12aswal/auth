import mongoose from "mongoose";

const emailVerificationSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15m'
    }
});

export const EmailVerify= mongoose.model('EmailVerify',emailVerificationSchema);
