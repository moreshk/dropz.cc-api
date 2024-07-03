import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { users } from './user';
import { timestamps } from './utils';

export const tokens = pgTable('tokens', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  address: varchar('address', { length: 256 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  symbol: varchar('symbol', { length: 256 }).notNull(),
  decimals: integer('decimals').notNull(),
  imageUrl: text('image_url').notNull(),
  coingeckoId: varchar('coingecko_id'),
  chainId: integer('chain_id').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  userId: varchar('user_id')
    .references(() => users.id)
    .notNull(),
  isVerified: boolean('is_verified').default(false),
  isPumpFun: boolean('is_pumpfun').default(false),
});

const baseSchema = createSelectSchema(tokens).omit(timestamps);

export const insertTokenSchema = createInsertSchema(tokens).omit(timestamps);
export const insertTokenParams = z.object({ body: baseSchema
  .extend({
    decimals: z.coerce.number(),
  })
  .omit({
    id: true,
    userId: true,
    isVerified: true,
    isPumpFun: true,
  }) });

export const updateTokenSchema = baseSchema;
export const updateTokenParams = z.object({ body: baseSchema
  .extend({
    decimals: z.coerce.number(),
  })
  .omit({
    userId: true,
    isVerified: true,
    isPumpFun: true,
  }) });
export const tokenIdSchema = z.object({
  body: baseSchema.pick({ id: true }),
});

export type Token = typeof tokens.$inferSelect;
export type NewToken = z.infer<typeof insertTokenSchema>;
export type NewTokenParams = z.infer<typeof insertTokenParams>['body'];
export type UpdateTokenParams = z.infer<typeof updateTokenParams>['body'];
