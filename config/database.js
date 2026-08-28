const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

    await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    throw error;
  }
};

module.exports = connectDB;
