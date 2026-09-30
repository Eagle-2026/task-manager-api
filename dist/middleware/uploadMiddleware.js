"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileImage = void 0;
const multer = require("multer");
const AppError = require("../utils/appError");
// Store uploaded image in memory
const storage = multer.memoryStorage();
// ========================================
// FILE FILTER
// ========================================
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new AppError("Only JPEG, PNG, and WEBP images are allowed.", 400));
};
// ========================================
// MULTER CONFIG
// ========================================
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter,
});
// Accept one file with field name "image"
const uploadProfileImage = upload.single("image");
exports.uploadProfileImage = uploadProfileImage;
