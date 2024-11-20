import connectDB from "./DB/db.js";
// import  express from "express";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();



connectDB().then(()=>{
    app.listen(8000,()=>{
        console.log("Server is running on port :", process.env.PORT);
    });
}).catch((error)=>{console.log(error)});