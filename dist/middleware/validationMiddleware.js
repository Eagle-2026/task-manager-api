"use strict";
// const validate = (schema) => {
//   return (req, res, next) => {
//     const result = schema.safeParse(req.body);
const AppError = require("../utils/appError");
// ========================================
// VALIDATION MIDDLEWARE
// ========================================
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const error = new AppError("Validation failed", 400);
            error.errors =
                result.error.issues;
            return next(error);
        }
        req.body = result.data;
        next();
    };
};
module.exports = validate;
