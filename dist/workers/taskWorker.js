"use strict";
const bullmq_1 = require("bullmq");
const redisConnection = require("../config/redis");
const logger = require("../utils/logger");
// ========================================
// TASK WORKER
// ========================================
const taskWorker = new bullmq_1.Worker("task-notifications", async (job) => {
    logger.info({
        jobId: job.id,
        jobName: job.name,
        taskId: job.data.taskId,
    }, "Background job started");
    // Pretend notification takes 3 seconds
    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
    logger.info({
        jobId: job.id,
        taskId: job.data.taskId,
        title: job.data.title,
    }, "Task notification processed");
    return {
        success: true,
    };
}, {
    connection: redisConnection,
});
// ========================================
// COMPLETED EVENT
// ========================================
taskWorker.on("completed", (job) => {
    logger.info({
        jobId: job.id,
    }, "Background job completed");
});
// ========================================
// FAILED EVENT
// ========================================
taskWorker.on("failed", (job, error) => {
    logger.error({
        jobId: job?.id,
        err: error,
    }, "Background job failed");
});
// ========================================
// GRACEFUL SHUTDOWN
// ========================================
const shutdown = async () => {
    logger.info("Closing task worker");
    await taskWorker.close();
    process.exit(0);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
module.exports = taskWorker;
