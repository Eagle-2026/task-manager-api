"use strict";
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const AppError = require("../utils/appError");
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
// ========================================
// PROTECT ROUTE
// ========================================
const protect = async (req, res, next) => {
    try {
        let accessToken;
        // 1. Get access token from cookie
        if (req.cookies.accessToken) {
            accessToken = req.cookies.accessToken;
        }
        // 2. No access token
        if (!accessToken) {
            throw new AppError("You are not logged in", 401);
        }
        // 3. Make sure JWT secret exists
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new Error("ACCESS_TOKEN_SECRET is missing");
        }
        // 4. Verify access token
        const decoded = jwt.verify(accessToken, secret);
        // jwt.verify() can technically return:
        // string OR object.
        // We expect an object containing id.
        if (typeof decoded === "string" || !decoded.id) {
            throw new AppError("Invalid access token", 401);
        }
        // 5. Find user
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            throw new AppError("The user belonging to this token no longer exists", 401);
        }
        // 6. Put authenticated user on request
        req.user = currentUser;
        // 7. Continue
        next();
    }
    catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        return next(new AppError("Invalid or expired access token", 401));
    }
};
exports.protect = protect;
