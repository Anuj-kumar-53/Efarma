import jwt from 'jsonwebtoken'


export const adminMiddleWare = async(req,res ,next )=>{
    try {
        let token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"No token generated"});
        }

           const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
             return res.status(401).json({message:"Wrong token go get a vaild one"});
        } 

        req.admin = decoded;
        req.isAdmin = true;
        next();


    } catch (error) {
         return res.status(400).json({message:"Error in middleWARE"});
    }
}