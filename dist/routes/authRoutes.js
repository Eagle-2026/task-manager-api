"use strict";
const express = require("express");
const authController_1 = require("../controllers/authController");
const validate = require("../middleware/validationMiddleware");
const authValidators_1 = require("../validators/authValidators");
const loginLimiter = require("../middleware/rateLimitMiddleware");
const router = express.Router();
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: adam@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid email or password
 */
router.post("/signup", validate(authValidators_1.signupSchema), authController_1.signup);
router.post("/login", validate(authValidators_1.loginSchema), loginLimiter, authController_1.login);
router.post("/refresh", authController_1.refresh);
router.post("/logout", authController_1.logout);
module.exports = router;
