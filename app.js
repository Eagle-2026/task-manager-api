const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://task-manager-frontend-xi-kohl.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task Manager Api is working",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;
