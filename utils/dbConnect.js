// npm i mongoose mongoose-unique-validator
// utils/dbConnect.js
import mongoose from "mongoose";
const dbConnect = async () => {
 if (mongoose.connection.readyState >= 1) {
 return;
 }
 mongoose.connect(process.env.DB_URI);
};
export default dbConnect;