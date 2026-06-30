import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: Redis | null = null;
let isRedisConnected = false;

export const connectRedis = (): Redis | null => {
  try {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        // Retry connection up to 3 times before staying disconnected
        if (times > 3) {
          console.warn('Redis reconnection limit reached. Caching disabled.');
          return null; 
        }
        return Math.min(times * 100, 2000);
      },
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log('Redis connected successfully.');
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      console.error('Redis error:', err.message || err);
    });

    redisClient.on('end', () => {
      isRedisConnected = false;
      console.warn('Redis connection closed.');
    });

    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
    return null;
  }
};

export const getRedisClient = (): Redis | null => {
  return redisClient;
};

export const getRedisStatus = (): boolean => {
  return isRedisConnected;
};

// Caching helper functions with safe execution fallbacks
export const setCache = async (key: string, value: string, ttlSeconds = 300): Promise<void> => {
  if (!redisClient || !isRedisConnected) return;
  try {
    await redisClient.set(key, value, 'EX', ttlSeconds);
  } catch (error) {
    console.error(`Error setting Redis key [${key}]:`, error);
  }
};

export const getCache = async (key: string): Promise<string | null> => {
  if (!redisClient || !isRedisConnected) return null;
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error(`Error getting Redis key [${key}]:`, error);
    return null;
  }
};

export const invalidateCache = async (key: string): Promise<void> => {
  if (!redisClient || !isRedisConnected) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Error deleting Redis key [${key}]:`, error);
  }
};
