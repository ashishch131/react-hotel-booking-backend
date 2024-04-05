import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();



const connect = async () =>{
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("db is connected!");
    } catch (error) {
        throw error;
    }
}

app.use(cors())
app.use(express.json());
app.use(cookieParser());
//middleware//
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(5000, () => {
    connect();
    console.log("backend is running!")
});