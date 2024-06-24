import process from 'node:process';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import Redis from 'ioredis';
import * as users from '@/schema/user';
import * as tokens from '@/schema/tokens';
import * as widgets from '@/schema/widgets';
import * as referral from '@/schema/referral';
import '@/env-config';

export const db = drizzle(postgres(process.env.DB_URL), { schema: {
  ...users,
  ...tokens,
  ...widgets,
  ...referral,
} });

const parsedUrl = new URL(process.env.REDIS_URL);

const redisOptions = {
  host: parsedUrl.hostname,
  port: +parsedUrl.port || 6379,
  password: parsedUrl.password,
  db: Number.parseInt(parsedUrl.pathname.split('/')[1]!) || 0,
};

export const redis = new Redis(redisOptions);
