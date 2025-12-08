import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import admin from "../model/admin.js";
import dotenv from "dotenv"
dotenv.config({ path: '../.env' })
const seedAdmin = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = process.env.EMAIL;
        const Password = process.env.PASSWORD;
        const hasPassword = await bcrypt.hash(Password,12);
        
        const adminUser =  await admin.create({

            email,password:hasPassword
        });
        
        console.log("admin Created",adminUser);
        
      
    } catch (error) {
        console.log("error occured  in admin");
        
    }
}


seedAdmin()
