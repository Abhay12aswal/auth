const setTokenCookies = (res, accessToken,refreshToken,newAccessTokenExp,newRefreshTokenExp)=>{

    const accessTokenMaxAge= (newAccessTokenExp-Math.floor(Date.now() /1000)) *1000;

    const refreshTokenMaxAge = (newRefreshTokenExp - Math.floor(Date.now()/1000))*1000;

    //set cookie for access token
    res.cookie('accessToken', accessToken,{
        httpOnly: true,
        secure:true,
        maxAge: accessTokenMaxAge
    })

    //set cookie for refresh token
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        secure:true,
        maxAge: refreshTokenMaxAge
    })


}

export default setTokenCookies;