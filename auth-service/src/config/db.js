const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Auth DB connected");
  } catch (error) {
    console.error("Auth DB connection failed");
    process.exit(1);
  }
};

module.exports = connectDB;
