import { relations, sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { tokens } from './tokens';
import { nanoid } from './utils';

export const referral = pgTable('referral', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => `ref_${nanoid()}`),
  feeWalletAddress: varchar('fee_wallet_address', { length: 256 }).notNull(),
  feePercentage: integer('fee_percentage').default(30).notNull(),
  tokenId: varchar('token_id', { length: 256 })
    .references(() => tokens.id)
    .notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

export const referralRelations = relations(referral, ({ one }) => ({
  token: one(tokens, {
    fields: [referral.tokenId],
    references: [tokens.id],
  }),
}));
