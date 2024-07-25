import { sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const spins = pgTable('spins', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  walletAddress: varchar('wallet_address', { length: 44 }).notNull(),
  spin: integer('spin').notNull(),
  points: integer('points').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
});

export const insertSpinSchema = createInsertSchema(spins);

export type Spin = typeof spins.$inferSelect;
export type NewSpin = typeof spins.$inferInsert;
