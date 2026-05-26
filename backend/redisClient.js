const Redis = require('ioredis');

// Using the host port mapped in docker-compose for Redis (6380 to avoid conflict)
const redisClient = new Redis({
  port: 6380,
  host: '127.0.0.1',
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;
