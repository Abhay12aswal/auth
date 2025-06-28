import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/connectdb.js';
import passport from 'passport';
dotenv.config();

const app= express();

const port = process.env.PORT || 8001;
const db= process.env.DB || " ";

const corsOptions = {
    origin:process.env.FRONTEND_HOST,
    credentials:true,
    optionSuccessStatus:200,
};

connectDB(db);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.listen(port,()=>{
    console.log(`server listening at ${port}`);
})

