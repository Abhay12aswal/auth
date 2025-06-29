import transporter from "../config/emailConfig.js";
import {EmailVerify} from "../models/EmailiVerify.model.js";

const sendEmailVerificationOTP = async (req, user) => {

    //generate a random 4-digit number
    const otp = Math.floor(1000 + Math.random() * 9000);

    //save otp in db
    await new EmailVerify({
        userId: user._id , otp
    }).save();

    //otp verificaiton link
    const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "OTP - Verify your account ✔",
        html: `<p>${user.name},</p>
        <p>Thank you for signing up with our website. to complete yout registration,
        please verify your email address by entering the following one-time password
        (OTP): ${otpVerificationLink}</p>
        <h2>OTP: ${otp}</h2>
        <p>This is valid for 15 minutes. If you didn't request
        this OTP, please ignore this email</p>
        `, // HTML body
    })

    return otp;


}

export default sendEmailVerificationOTP;