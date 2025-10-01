import Redis from 'ioredis'
import { config } from '../config'
import { logger } from '../utils/logger';

export const redis = new Redis(config.redisUrl)

// Connect to Redis
redis.on('connect', () => {
    logger.info(`✅ Redis connected successfully`);
});

redis.on('error', (error) => {
    logger.error("❌ Redis connection error:", { error: error.message });
});

redis.on('reconnecting', () => {
    logger.warn("🔄 Redis attempting to reconnect...");
});