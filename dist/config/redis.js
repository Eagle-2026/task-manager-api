"use strict";
let redisConnection;
if (process.env.REDIS_URL) {
    const redisUrl = new URL(process.env.REDIS_URL);
    redisConnection = {
        host: redisUrl.hostname,
        port: Number(redisUrl.port || 6379),
        username: redisUrl.username || undefined,
        password: redisUrl.password || undefined,
        ...(redisUrl.protocol === "rediss:"
            ? { tls: {} }
            : {}),
    };
}
else {
    redisConnection = {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379),
    };
}
module.exports = redisConnection;
