// const errorHandler = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// };

// module.exports = errorHandler;
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    err.statusCode = 404;
    err.status = "fail";
    err.message = "Task not found";
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(err.errors && { errors: err.errors }),
  });
};

module.exports = errorHandler;