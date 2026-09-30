"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const node_stream_1 = require("node:stream");
const cloudinary = require("../config/cloudinary");
// ========================================
// UPLOAD IMAGE
// ========================================
const uploadImage = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: "image",
            folder: "task-manager/profile-images",
            ...options,
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error("Cloudinary upload returned no result"));
            }
            resolve(result);
        });
        const bufferStream = new node_stream_1.PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(uploadStream);
    });
};
exports.uploadImage = uploadImage;
// ========================================
// DELETE IMAGE
// ========================================
const deleteImage = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};
exports.deleteImage = deleteImage;
