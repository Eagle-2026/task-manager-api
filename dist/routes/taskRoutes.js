"use strict";
const express = require("express");
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const taskValidators_1 = require("../validators/taskValidators");
const router = express.Router();
// ========================================
// PROTECT ALL TASK ROUTES
// ========================================
// Every route below requires the user
// to be logged in.
router.use(authMiddleware_1.protect);
// ========================================
// TASK COLLECTION ROUTES
// ========================================
// GET /api/v1/tasks
// Return tasks available to the logged-in user.
//
// POST /api/v1/tasks
// Create a new task for the logged-in user.
router
    .route("/")
    .get(taskController_1.getAllTasks)
    .post(validate(taskValidators_1.createTaskSchema), taskController_1.createTask);
// ========================================
// SINGLE TASK ROUTES
// ========================================
// GET /api/v1/tasks/:id
// Return one task.
//
// PATCH /api/v1/tasks/:id
// Update one task.
//
// DELETE /api/v1/tasks/:id
// Delete one task.
router
    .route("/:id")
    .get(taskController_1.getTaskById)
    .patch(validate(taskValidators_1.updateTaskSchema), taskController_1.updateTask)
    .delete(taskController_1.deleteTask);
module.exports = router;
