import mongoose from "mongoose";

const connectDB = async () =>{
    try {
       const con = await mongoose.connect(process.env.MONGO_URI);
       console.log(con.connection.host,"database connected");
       
       
       
    } catch (error) {
        console.log("error occured in db: ",error);
        process.exit(1)
        
    }
}
export default connectDB;