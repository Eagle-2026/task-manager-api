// const express = require("express");
// const {
//   createTask,
//   getAllTasks,
//   getTaskById,
//   updateTask,
//   deleteTask
// } = require("../controllers/taskController");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// // routes
// router.post("/", protect, createTask);
// router.get("/", protect, getAllTasks);
// router.get("/:id", protect, getTaskById);
// router.patch("/:id", protect, updateTask);
// router.delete("/:id", protect, deleteTask);

// module.exports = router;

// // ============================================
// More structured version
const express = require("express");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { createTaskSchema,updateTaskSchema } = require("../validators/taskValidators");

const router = express.Router();

// Routes


// GET all tasks
// POST create task
router
  .route("/")
  .get(protect, getAllTasks)
  .post(protect, validate(createTaskSchema), createTask);

// GET one task
// PATCH update task
// DELETE task
router
  .route("/:id")
  .get(protect, getTaskById)
  .patch(protect, validate(updateTaskSchema), updateTask)
  .delete(protect, deleteTask);

module.exports = router;
