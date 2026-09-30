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
exports.deleteTask = exports.updateTask = exports.getTask = exports.createTask = exports.getTasks = void 0;
const taskRepository = __importStar(require("../repositories/taskRepository"));
const AppError = require("../utils/appError");
const taskQueue = require("../queues/taskQueue");
// ========================================
// BUILD USER FILTER
// ========================================
const buildUserFilter = (user) => {
    const filter = {};
    // Normal user → only their tasks
    // Admin → all users' tasks
    if (user.role !== "admin") {
        filter.user = user._id;
    }
    return filter;
};
// ========================================
// GET ALL TASKS
// ========================================
const getTasks = async (user, query) => {
    // 1. PAGINATION
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 100;
    const skip = (page - 1) * limit;
    // 2. FILTER
    const filter = buildUserFilter(user);
    if (query.completed !== undefined) {
        filter.completed = query.completed === "true";
    }
    // 3. SEARCH
    if (query.search) {
        const searchRegex = new RegExp(query.search, "i");
        filter.$or = [
            {
                title: searchRegex,
            },
            {
                description: searchRegex,
            },
        ];
    }
    // 4. COUNT TASKS
    const totalTasks = await taskRepository.countTasks(filter);
    const totalPages = Math.ceil(totalTasks / limit);
    if (page > totalPages && totalPages > 0) {
        throw new AppError("This page does not exist", 404);
    }
    // 5. SORTING
    const sort = query.sort || "-createdAt";
    // 6. GET TASKS
    const tasks = await taskRepository.findTasks({
        filter,
        sort,
        skip,
        limit,
    });
    // 7. RETURN RESULT
    return {
        tasks,
        pagination: {
            currentPage: page,
            limit,
            totalTasks,
            totalPages,
        },
    };
};
exports.getTasks = getTasks;
// ========================================
// CREATE TASK
// ========================================
const createTask = async (user, taskData) => {
    const task = await taskRepository.createTask({
        ...taskData,
        user: user._id,
    });
    await taskQueue.add("task-created-notification", {
        taskId: task._id.toString(),
        userId: user._id.toString(),
        title: task.title,
    }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 10000,
        },
    });
    return task;
};
exports.createTask = createTask;
// ========================================
// GET TASK BY ID
// ========================================
const getTask = async (user, id) => {
    const filter = buildUserFilter(user);
    filter._id = id;
    const task = await taskRepository.findOneTask(filter);
    if (!task) {
        throw new AppError("Task not found", 404);
    }
    return task;
};
exports.getTask = getTask;
// ========================================
// UPDATE TASK
// ========================================
const updateTask = async (user, id, updateData) => {
    const filter = buildUserFilter(user);
    filter._id = id;
    const task = await taskRepository.updateTask(filter, updateData);
    if (!task) {
        throw new AppError("Task not found", 404);
    }
    return task;
};
exports.updateTask = updateTask;
// ========================================
// DELETE TASK
// ========================================
const deleteTask = async (user, id) => {
    const filter = buildUserFilter(user);
    filter._id = id;
    const task = await taskRepository.deleteTask(filter);
    if (!task) {
        throw new AppError("Task not found", 404);
    }
    return task;
};
exports.deleteTask = deleteTask;
