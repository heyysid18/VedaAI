import Redis, { RedisOptions } from 'ioredis';
import { env } from './env';

const isTls = env.REDISS || env.REDIS_URL.startsWith('rediss://');

const redisOptions: RedisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // mandatory for BullMQ
  lazyConnect: true,
  tls: isTls ? {} : undefined,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

// Singleton client shared across the app
export const redisClient = env.REDIS_URL
  ? new Redis(env.REDIS_URL, redisOptions)
  : new Redis(redisOptions);

redisClient.on('connect', () => console.log('✅  Redis connected'));
redisClient.on('ready', () => console.log('🟢  Redis ready'));
redisClient.on('error', (err) => console.error('❌  Redis error:', err.message));
redisClient.on('close', () => console.warn('⚠️   Redis connection closed'));

export async function connectRedis(): Promise<void> {
  try {
    if (redisClient.status === 'wait') {
      await redisClient.connect();
    }
  } catch (err: any) {
    console.error('❌  Could not connect to Redis:', err.message);
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    await redisClient.quit();
    console.log('🔌  Redis disconnected');
  } catch (err) {
    // ignore
  }
}

export { redisOptions };
export type { RedisOptions };