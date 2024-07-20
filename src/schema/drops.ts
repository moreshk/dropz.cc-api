import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { tokens } from './tokens';
import { nanoid } from './utils';

export const drops = pgTable('drops', {
  id: varchar('id', { length: 256 })
    .primaryKey().$defaultFn(() => `drop_${nanoid()}`),
  tokenId: varchar('token_id', { length: 256 })
    .references(() => tokens.id)
    .notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  tokens: integer('tokens').default(0),
  listing: boolean('listing').default(true),
  maxDuration: integer('maxDuration').default(86400),
  startTime: timestamp('start_time')
    .notNull()
    .default(sql`now()`),
  winners: integer('winners').default(0),
  exhausted: boolean('exhausted').default(false),
});

export const dropsRelations = relations(drops, ({ one }) => ({
  token: one(tokens, {
    fields: [drops.tokenId],
    references: [tokens.id],
  }),
}));
