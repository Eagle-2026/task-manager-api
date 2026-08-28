const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// HttpOnly Cookie Approach
// Create a JWT token using the user's ID
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// Create JWT → store it in HttpOnly cookie → send response
const createSendToken = (user, statusCode, res) => {
  // 1. Create JWT token using the user's ID
  const token = signToken(user._id);
  // 2. Configure the cookie
  const cookieOptions = {
    maxAge: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  // 3. Make the cookie secure when running in production (HTTPS)
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  // 4. Store the JWT inside an HttpOnly cookie
  res.cookie("jwt", token, cookieOptions);
  // 5. Remove the password before sending the user to the client
  user.password = undefined;
  // 6. Send the response
  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};
// signup
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  // Create JWT + HttpOnly cookie + response
  createSendToken(user, 201, res);
});

// login
exports.login = asyncHandler(async (req, res) => {
  // 1. Check email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }
  // 2. Find user and include password
  const user = await User.findOne({ email }).select("+password");
  // 3. Check user and password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }
  // 4. Create JWT + send cookie
  createSendToken(user, 200, res);
});


// logout
exports.logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
