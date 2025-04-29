const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/LibraryDB");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};
// const connectUserDB=async(req,res)=>{
//   try{
//     await mongoose.connect("mongodb://localhost:27017/userDB");
//     console.log("MongoDB Connected");
//   }catch(error){
//     console.error("MongoDB Connection Error:", error);
//   }
// }
module.exports = connectDB;
