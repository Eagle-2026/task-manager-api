require("dotenv").config();

const connectDB = require("./config/database");
const app = require("./app");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on Port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();