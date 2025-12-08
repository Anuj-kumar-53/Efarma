import admin from "../model/admin.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const adminLogin = async (req,res) =>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"invalid username and password"});
        }

        const userAdmin = await admin.findOne({email});
        if(!userAdmin){
            return res.status(400).json({message:"not a valid email for admin"});
        }
        const isValid = await bcrypt.compare(password,userAdmin.password);
        if(!isValid){
             return res.status(400).json({message:"not a valid password for admin"});

         } 

         const token = jwt.sign(
            {id:userAdmin._id,email:userAdmin.email},
            process.env.JWT_SECRET,
            {expiresIn: '24h'} 
         );

         res.cookie('token', token,{
             httpOnly: true, // Prevents XSS attacks
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'lax', // Prevents CSRF attacks
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
         })



        return res.status(200).json({ 
            message: "Login successful",
            token: token, // Optional: if you want to use localStorage as well
            user: {
                id: userAdmin._id,
                email: userAdmin.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Logout not possible",error});
    }
}

export const logout = async(req,res)=>{
    try {
        await res.clearCookie('token');
        return res.status(200).json({message:"Logout successfull!"});
        
    } catch (error) {
        console.log("error in logout",error);
        return res.status(500).json({message:"Logout not possible"});
    }
}



