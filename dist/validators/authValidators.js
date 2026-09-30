"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(20, "Name cannot exceed 20 characters"),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email("Please provide a valid email"),
    password: zod_1.z
        .string()
        .min(4, "Password must be at least 4 characters"),
})
    .strict();
exports.loginSchema = zod_1.z
    .object({
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email("Please provide a valid email"),
    password: zod_1.z
        .string()
        .min(1, "Password is required"),
})
    .strict();
