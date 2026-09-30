"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileImage = exports.deleteUser = exports.getAllUsers = exports.adminTest = exports.getMe = void 0;
const asyncHandler = require("express-async-handler");
const userService = __importStar(require("../services/userService"));
// ========================================
// GET CURRENT USER
// ========================================
exports.getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            user: req.user,
        },
    });
});
// ========================================
// ADMIN TEST
// ========================================
exports.adminTest = asyncHandler(async (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome Admin",
    });
});
// ========================================
// GET ALL USERS
// ========================================
exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    if (users.length === 0) {
        res.status(200).json({
            status: "success",
            message: "No users found",
            results: 0,
            data: {
                users: [],
            },
        });
        return;
    }
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});
// ========================================
// DELETE USER
// ========================================
exports.deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(200).json({
        status: "success",
        message: "User deleted successfully",
    });
});
// ========================================
// UPDATE PROFILE IMAGE
// ========================================
exports.updateProfileImage = asyncHandler(async (req, res) => {
    const user = await userService.updateProfileImage(req.user._id, req.file, req.log);
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});
