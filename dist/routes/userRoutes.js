"use strict";
const express = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = express.Router();
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.restrictTo)("admin"), userController_1.getAllUsers);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.restrictTo)("admin"), userController_1.deleteUser);
router.get("/me", authMiddleware_1.protect, userController_1.getMe);
router.post("/upload-test", uploadMiddleware_1.uploadProfileImage, (req, res) => {
    res.status(200).json({
        status: "success",
        file: {
            originalname: req.file?.originalname,
            mimetype: req.file?.mimetype,
            size: req.file?.size,
        },
    });
});
router.patch("/me/profile-image", authMiddleware_1.protect, uploadMiddleware_1.uploadProfileImage, userController_1.updateProfileImage);
module.exports = router;
