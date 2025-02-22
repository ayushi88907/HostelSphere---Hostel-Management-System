import mongoose from "mongoose";

export const dbConnect = async () => {
 try {

     const db = await mongoose.connect(
       process.env.DB_CONNECTION_STRING + process.env.DB_NAME
     );
   
     return db;

 } catch (error) {
    console.log('Database connection failed', error.message);
    throw error;
 }
};
