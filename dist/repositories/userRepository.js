"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileImage = exports.deleteById = exports.findAll = exports.findById = void 0;
const User = require("../models/userModel");
// ========================================
// FIND USER BY ID
// ========================================
const findById = async (userId) => {
    return User.findById(userId);
};
exports.findById = findById;
// ========================================
// FIND ALL USERS
// ========================================
const findAll = async () => {
    return User.find();
};
exports.findAll = findAll;
// ========================================
// DELETE USER BY ID
// ========================================
const deleteById = async (userId) => {
    return User.findByIdAndDelete(userId);
};
exports.deleteById = deleteById;
// ========================================
// UPDATE PROFILE IMAGE
// ========================================
const updateProfileImage = async (userId, profileImage) => {
    return User.findByIdAndUpdate(userId, {
        profileImage,
    }, {
        returnDocument: "after",
        runValidators: true,
    }).select("-password");
};
exports.updateProfileImage = updateProfileImage;
