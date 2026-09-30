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
exports.updateProfileImage = exports.deleteUser = exports.getAllUsers = void 0;
const userRepository = require("../repositories/userRepository");
const cloudinaryService = __importStar(require("./cloudinaryService"));
const AppError = require("../utils/appError");
// ========================================
// GET ALL USERS
// ========================================
const getAllUsers = async () => {
    return userRepository.findAll();
};
exports.getAllUsers = getAllUsers;
// ========================================
// DELETE USER
// ========================================
const deleteUser = async (userId) => {
    const user = await userRepository.deleteById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};
exports.deleteUser = deleteUser;
// ========================================
// UPDATE PROFILE IMAGE
// ========================================
const updateProfileImage = async (userId, file, log) => {
    if (!file) {
        throw new AppError("Please upload an image.", 400);
    }
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new AppError("User not found.", 404);
    }
    const oldPublicId = user.profileImage?.publicId;
    const uploaded = await cloudinaryService.uploadImage(file.buffer);
    let updatedUser;
    try {
        updatedUser = await userRepository.updateProfileImage(userId, {
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
        });
    }
    catch (error) {
        try {
            await cloudinaryService.deleteImage(uploaded.public_id);
        }
        catch (cleanupError) {
            log?.error({
                userId,
                err: cleanupError,
            }, "Failed to clean up uploaded image");
        }
        throw error;
    }
    if (oldPublicId) {
        try {
            await cloudinaryService.deleteImage(oldPublicId);
        }
        catch (error) {
            log?.warn({
                userId,
                oldPublicId,
                err: error,
            }, "Failed to delete old profile image");
        }
    }
    return updatedUser;
};
exports.updateProfileImage = updateProfileImage;
