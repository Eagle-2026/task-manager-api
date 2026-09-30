"use strict";
const express_rate_limit_1 = require("express-rate-limit");
const loginLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        status: "fail",
        message: "Too many login attempts. Please try again later.",
    },
});
module.exports = loginLimiter;
