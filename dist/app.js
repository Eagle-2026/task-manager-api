"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express = require("express");
const helmet_1 = __importDefault(require("helmet"));
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express_rate_limit_1 = require("express-rate-limit");
const pino_http_1 = __importDefault(require("pino-http"));
const node_crypto_1 = require("node:crypto");
const swaggerUi = require("swagger-ui-express");
// ========================================
// ROUTES
// ========================================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
// ========================================
// ERROR HANDLER
// ========================================
const errorHandler = require("./middleware/errorMiddleware");
// ========================================
// LOGGER
// ========================================
const logger = require("./utils/logger");
// ========================================
// SWAGGER
// ========================================
const swaggerSpec = require("./docs/swagger");
const app = express();
// ========================================
// LOGGER
// ========================================
app.use((0, pino_http_1.default)({
    logger,
    // Create / reuse request ID
    genReqId(req, res) {
        const existingId = req.headers["x-request-id"];
        const id = typeof existingId === "string" ? existingId : (0, node_crypto_1.randomUUID)();
        res.setHeader("X-Request-Id", id);
        return id;
    },
    // Choose log level based on response
    customLogLevel(req, res, err) {
        if (err || res.statusCode >= 500) {
            return "error";
        }
        if (res.statusCode >= 400) {
            return "warn";
        }
        return "info";
    },
    // Keep request logs short
    serializers: {
        req(req) {
            return {
                id: req.id,
                method: req.method,
                url: req.url,
            };
        },
        res(res) {
            return {
                statusCode: res.statusCode,
            };
        },
    },
}));
// ========================================
// HELMET
// ========================================
app.use((0, helmet_1.default)());
// ========================================
// CORS
// ========================================
const allowedOrigins = [
    "http://localhost:3001",
    process.env.FRONTEND_URL,
].filter((origin) => Boolean(origin));
app.use(cors({
    origin: (origin, callback) => {
        // Postman/server-to-server requests
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
// ========================================
// RATE LIMITING
// ========================================
const apiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", apiLimiter);
// ========================================
// REQUEST SIZE LIMIT
// ========================================
app.use(express.json({
    limit: "10kb",
}));
// ========================================
// COOKIE PARSER
// ========================================
app.use(cookieParser());
// ========================================
// ROOT ROUTE
// ========================================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Task Manager Api is working",
    });
});
// ========================================
// HEALTH CHECK
// ========================================
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Backend is running",
    });
});
// ========================================
// ROUTES
// ========================================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
// ========================================
// SWAGGER API DOCUMENTATION
// ========================================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ========================================
// GLOBAL ERROR HANDLER
// ========================================
// Must remain after routes.
app.use(errorHandler);
module.exports = app;
