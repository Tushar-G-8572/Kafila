import 'dotenv/config';
import redis from "ioredis";

const redisClient = new redis({
 host:process.env.REDIS_HOST,
 port:process.env.REDIS_PORT,
 password:process.env.REDIS_PASSWORD
})

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redisClient;