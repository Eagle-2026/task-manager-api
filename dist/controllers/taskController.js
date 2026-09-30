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
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const asyncHandler = require("express-async-handler");
const taskService = __importStar(require("../services/taskService"));
// ========================================
// CREATE TASK
// ========================================
exports.createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.user, req.body);
    res.status(201).json({
        status: "success",
        data: {
            task,
        },
    });
});
// ========================================
// GET ALL TASKS
// ========================================
exports.getAllTasks = asyncHandler(async (req, res) => {
    const result = await taskService.getTasks(req.user, req.query);
    res.status(200).json({
        status: "success",
        results: result.tasks.length,
        pagination: result.pagination,
        data: {
            tasks: result.tasks,
        },
    });
});
// ========================================
// GET TASK BY ID
// ========================================
exports.getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTask(req.user, req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            task,
        },
    });
});
// ========================================
// UPDATE TASK
// ========================================
exports.updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.user, req.params.id, req.body);
    res.status(200).json({
        status: "success",
        data: {
            task,
        },
    });
});
// ========================================
// DELETE TASK
// ========================================
exports.deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.user, req.params.id);
    res.status(204).send();
});
