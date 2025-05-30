const Queue = require("bull");
const Redis = require("ioredis");

const redisConfig = {
  port: 10771,
  host: "redis-10771.c266.us-east-1-3.ec2.redns.redis-cloud.com",
  username: "default",
  password: "I0tHMxZ0fs4dKri2HrPGgZrzLSBWEjfK",
};

const client = new Redis(redisConfig);

const rolePredictionQueue = new Queue("role-prediction", client);

module.exports = rolePredictionQueue;
