import { config } from "dotenv";
import mongoose from "mongoose";
config()
export async function dbConnect(){
    console.log(process.env.MONGO_URL)
   try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connection successfully");
    } catch (error) {
        console.log(error);
        process.exit();
    }
}