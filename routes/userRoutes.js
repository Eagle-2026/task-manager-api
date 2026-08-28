const express = require("express");
const { getMe, getAllUsers,deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, restrictTo("admin"), getAllUsers);
router.delete("/:id",protect,restrictTo("admin"),deleteUser)
// my current user route
router.get("/me", protect, getMe);
module.exports = router;
