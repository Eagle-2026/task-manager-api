"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.findOneTask = exports.countTasks = exports.findTasks = void 0;
const Task = require("../models/taskModel");
// ========================================
// FIND MANY TASKS
// ========================================
const findTasks = async ({ filter, sort, skip, limit, }) => {
    return Task.find(filter).sort(sort).skip(skip).limit(limit);
};
exports.findTasks = findTasks;
// ========================================
// COUNT TASKS
// ========================================
const countTasks = async (filter) => {
    return Task.countDocuments(filter);
};
exports.countTasks = countTasks;
// ========================================
// FIND ONE TASK
// ========================================
const findOneTask = async (filter) => {
    return Task.findOne(filter);
};
exports.findOneTask = findOneTask;
// ========================================
// CREATE TASK
// ========================================
const createTask = async (data) => {
    return Task.create(data);
};
exports.createTask = createTask;
// ========================================
// UPDATE TASK
// ========================================
const updateTask = async (filter, data) => {
    return Task.findOneAndUpdate(filter, data, {
        returnDocument: "after",
        runValidators: true,
    });
};
exports.updateTask = updateTask;
// ========================================
// DELETE TASK
// ========================================
const deleteTask = async (filter) => {
    return Task.findOneAndDelete(filter);
};
exports.deleteTask = deleteTask;
