import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { tokens } from './tokens';

export const leaderboard = pgTable('leaderboard', {
  id: varchar('id', { length: 256 })
    .primaryKey(),
  tokenId: varchar('token_id', { length: 256 })
    .references(() => tokens.id)
    .notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  points: integer('points').default(0),
  listing: boolean('listing').default(true),
});

export const leaderboardRelations = relations(leaderboard, ({ one }) => ({
  token: one(tokens, {
    fields: [leaderboard.tokenId],
    references: [tokens.id],
  }),
}));
