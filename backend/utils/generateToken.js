import jwt from 'jsonwebtoken';
import { asyncHandler } from './asyncHandler.js';
import { UserRefreshToken } from '../models/userRefreshToken.model.js';

const generateTokens = asyncHandler(async (user) => {

    const payload = { _id: user._id, roles: user.roles };

    //generate access token with expireation time 100s
    const accessTokenExp = Math.floor(Date.now() / 1000) + 100;

    const accessToken = jwt.sign({
        ...payload, exp: accessTokenExp
    },
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    )

    //refresh token expiration time
    const refreshTokenExp = Math.floor(Date.now()/1000)+60*60*24*5;

    //refresh token
    const refreshToken = jwt.sign({
        ...payload , exp: refreshTokenExp
    }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
        // {
        //     expiresIn: refreshTokenExp
        // }
    )

    const CheckUserRefreshToken = await UserRefreshToken.findOne({
        userId: user._id
    })

    //if present remove it 
    if(CheckUserRefreshToken){
        await UserRefreshToken.remove()
    }

    //save new refresh toekn 
    await new UserRefreshToken({
        userId: user._id, token: refreshToken
    }).save();

    return { accessToken, refreshToken, accessTokenExp, refreshTokenExp }
})

export default generateTokens;