import { sql } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const bumps = pgTable('bumps', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  tokenAddress: varchar('token_address', { length: 256 }).notNull(),
  userWalletAddress: varchar('user_wallet_address', { length: 44 }).notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

export const insertBumpSchema = createInsertSchema(bumps);
export const selectBumpSchema = createSelectSchema(bumps);
