import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js";
import { EmailVerify } from "../models/EmailiVerify.model.js";


export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, password_confirmation } = req.body;

    if (
        [name, email, password,password_confirmation].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if(password !== password_confirmation){
        return res.status(400).json({
            success: false,
            msg: "Password does not match"
        })
    }

    const exist = await User.findOne({
        email
    })

    if (exist) {
        throw new ApiError(400, "User already exist")
    }

    const salt = await bcrypt.genSalt(8);
    const newPassword = await bcrypt.hash(password,salt);

    const user = await User.create({
        name, email, password:newPassword
    })

    sendEmailVerificationOTP(req,user);

    if (!user) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json({
        success:true,
        msg: "user created",
        user
    })
})

//user email verification
export const verifyEmail= asyncHandler(async(req,res,next)=>{

    const {email, otp}= req.body;
    if(!email || !otp){
        throw new ApiError(400,"All fields are required")
    }

    const existingUser = await User.findOne({email});
    if(!existingUser){
        throw new ApiError(400,"Email does not exist")
    }

    if(existingUser.is_verified){
        throw new ApiError(400,"Email is already verified")
    }

    //check if email  otp is matching or not
    const emailVerification = await EmailVerify.findOne({
        userId: existingUser._id, otp
    });

    if(!emailVerification){
        if(!existingUser.is_verified){
            await sendEmailVerificationOTP(req,existingUser);
            throw new ApiError(400,"Invalid OTP, new OTP sent to your email")
        }
        throw new ApiError(400,"Invalid OTP")
    }

    //check if otp is expired
    const currectTime = new Date();
    const expirationTime= new Date(emailVerification.createdAt.getTime()+ 15*60*1000);
    if(currectTime> expirationTime){
        //otp expired
        await sendEmailVerificationOTP(req,existingUser);
        throw new ApiError(400,"OTP expired, new OTP sent to your email");
    }

    //otp is valid and not expired , mark email is verified
    existingUser.is_verified= true;
    await existingUser.save();

    await EmailVerify.deleteMany({userId: existingUser._id});
    return res.status(200).json({
        status:"success",
        mesage: "Email verified successfully"
    })

})

export const login= asyncHandler(async(req,res,next)=>{


})