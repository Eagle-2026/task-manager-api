"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
// ========================================
// CREATE TASK
// ========================================
exports.createTaskSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(100, "Title cannot exceed 100 characters"),
    description: zod_1.z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
    completed: zod_1.z
        .boolean()
        .optional(),
})
    .strict();
// ========================================
// UPDATE TASK
// ========================================
exports.updateTaskSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(100, "Title cannot exceed 100 characters")
        .optional(),
    description: zod_1.z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
    completed: zod_1.z
        .boolean()
        .optional(),
})
    .strict();
