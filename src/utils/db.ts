import process from 'node:process';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as users from '@/schema/user';
import * as tokens from '@/schema/tokens';
import * as widgets from '@/schema/widgets';
import '@/env-config';

export const db = drizzle(postgres(process.env.DB_URL), { schema: {
  ...users,
  ...tokens,
  ...widgets,
} });
