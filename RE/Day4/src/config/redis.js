const { createClient } =require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-10846.crce276.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 10846
    }
});
module.exports =redisClient;


