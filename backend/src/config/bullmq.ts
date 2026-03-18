import Redis from 'ioredis';
import { redisOptions } from './redis';

import { env } from './env';

// BullMQ manages its own connections — pass a new Redis instance with shared options
export const bullmqConnection = (env.REDIS_URL
  ? new Redis(env.REDIS_URL, redisOptions)
  : new Redis(redisOptions)) as any;