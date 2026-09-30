"use strict";
// const errorHandler = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";
// ========================================
// GLOBAL ERROR HANDLER
// ========================================
const errorHandler = (err, req, res, next) => {
    // ========================================
    // DEFAULT ERROR VALUES
    // ========================================
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // ========================================
    // MONGODB CAST ERROR
    // ========================================
    if (err.name === "CastError") {
        err.statusCode = 400;
        err.status = "fail";
        err.message = `Invalid value "${String(err.value)}" for field "${err.path}"`;
    }
    // ========================================
    // ERROR LOGGING
    // ========================================
    if (err.statusCode >= 500) {
        req.log.error({
            err,
        }, "Unexpected server error");
    }
    else {
        req.log.warn({
            statusCode: err.statusCode,
            message: err.message,
        }, "Request failed");
    }
    // ========================================
    // PRODUCTION 500 ERROR
    // ========================================
    if (process.env.NODE_ENV === "production" && err.statusCode >= 500) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong",
        });
    }
    // ========================================
    // SEND NORMAL ERROR RESPONSE
    // ========================================
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(err.errors !== undefined ? { errors: err.errors } : {}),
    });
};
module.exports = errorHandler;
