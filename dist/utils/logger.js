"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const pino_1 = __importDefault(require("pino"));
const isProduction = process.env.NODE_ENV === "production";
const logger = (0, pino_1.default)({
    level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
    redact: {
        paths: [
            "req.headers.cookie",
            "req.headers.authorization",
            "res.headers.set-cookie",
            "password",
            "passwordConfirm",
            "body.password",
            "body.passwordConfirm",
            "token",
        ],
        censor: "[REDACTED]",
    },
    ...(isProduction
        ? {}
        : {
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                },
            },
        }),
});
module.exports = logger;
