import jwt from 'jsonwebtoken';
import Farmer from '../models/Farmer.js';

export const farmerAuth = async(req, res, next) => {
    try {
        let token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"No token generated"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Wrong token go get a valid one"});
        } 

       
        const farmer = await Farmer.findById(decoded.id);
        if (!farmer) {
            return res.status(403).json({message: "Farmer access required"});
        }

        req.farmer = farmer;
        next();

    } catch (error) {
        return res.status(400).json({message:"Error in farmer middleware"});
    }
}