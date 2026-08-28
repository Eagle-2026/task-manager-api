const express = require("express");
const { signup, login,logout } = require("../controllers/authController");
const validate = require("../middleware/validationMiddleware");
const {
  signupSchema,
  loginSchema,
} = require("../validators/authValidators");

const router = express.Router();

router.post("/signup",  validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

module.exports = router;
