"use strict";
const bullmq_1 = require("bullmq");
const redisConnection = require("../config/redis");
// ========================================
// TASK QUEUE
// ========================================
const taskQueue = new bullmq_1.Queue("task-notifications", {
    connection: redisConnection,
});
module.exports = taskQueue;
