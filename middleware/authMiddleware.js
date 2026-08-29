const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// exports.protect = async (req, res, next) => {
//   try {
//     let token;
//     // 1. Check if JWT exists in cookies
//     if (req.cookies.jwt) {
//       token = req.cookies.jwt;
//     }
//     // 2. If no token, reject request
//     if (!token) {
//       return res.status(401).json({
//         status: "fail",
//         message: "You are not logged in",
//       });
//     }
//     // 3. Verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // 4. Find user
//     const currentUser = await User.findById(decoded.id);
//     if (!currentUser) {
//       return res.status(401).json({
//         status: "fail",
//         message: "The user belonging to this token no longer exists",
//       });
//     }
//     // 5. Put user on request
//     req.user = currentUser;
//     // 6. Move to the next middleware/controller
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       status: "fail",
//       message: "Invalid or expired token",
//     });
//   }
// };


// exports.protect = async (req, res, next) => {
//   try {
//     let token;

//     // 1. Check if JWT exists in cookies
//     if (req.cookies.jwt) {
//       token = req.cookies.jwt;
//     }

//     // 2. No token
//     if (!token) {
//       throw new AppError("You are not logged in", 401);
//     }

//     // 3. Verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 4. Find user
//     const currentUser = await User.findById(decoded.id);

//     if (!currentUser) {
//       throw new AppError(
//         "The user belonging to this token no longer exists",
//         401
//       );
//     }

//     // 5. Put user on request
//     req.user = currentUser;

//     // 6. Continue
//     next();

//   } catch (error) {
//     if (error instanceof AppError) {
//       return next(error);
//     }

//     return next(new AppError("Invalid or expired token", 401));
//   }
// };


exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new AppError("You are not logged in", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.time("findUser");

    const currentUser = await User.findById(decoded.id);

    console.timeEnd("findUser");

    if (!currentUser) {
      throw new AppError(
        "The user belonging to this token no longer exists",
        401
      );
    }

    req.user = currentUser;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Invalid or expired token", 401));
  }
};