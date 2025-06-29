import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err,req,res,next)=>{
    let statusCode=500;
    let message= "Internal server error";

    if(err instanceof ApiError){
        statusCode= err.statusCode || 500;
        message=err.message;
    } else{
        message=err.message || message;
    }

    return res.status(statusCode).json({
        success: false,
        message,
    })
}

export {errorHandler}