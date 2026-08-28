const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

exports.adminTest= asyncHandler(async(req,res)=>{
  res.status(200).json({
    status: "success",
    message: "Welcome Admin",
  });
})

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (users.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No users found",
      results: 0,
      data: {
        users: [],
      },
    });
  }

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// delete user

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  // if (!user) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "User not found",
  //   });
  // }
  if (!user) {
  throw new AppError("User not found", 404);
}

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});