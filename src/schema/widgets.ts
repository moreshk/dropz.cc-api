import { relations, sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import z from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { tokens } from './tokens';
import { users } from './user';
import { nanoid, timestamps } from './utils';

export const widgets = pgTable('widgets', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => `wget_${nanoid()}`),
  feeWalletAddress: varchar('fee_wallet_address', { length: 256 }).notNull(),
  feePercentage: integer('fee_percentage').default(30).notNull(),
  website: text('widget_site'),
  tokenId: varchar('token_id', { length: 256 })
    .references(() => tokens.id)
    .notNull(),
  userId: varchar('user_id', { length: 256 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

export const widgetsRelations = relations(widgets, ({ one }) => ({
  token: one(tokens, {
    fields: [widgets.tokenId],
    references: [tokens.id],
  }),
}));

const baseSchema = createSelectSchema(widgets).omit(timestamps);

export const insertWidgetSchema = createInsertSchema(widgets).omit(timestamps);

export const insertWidgetParams = z.object({
  body: baseSchema
    .extend({
      feeWalletAddress: z.string().min(12, 'Please Add Fee wallet'),
      tokenId: z.string().min(12, 'Please select token'),
      website: z.string().url('Invalid url').optional(),
    })
    .omit({
      id: true,
      userId: true,
      feePercentage: true,
    }),
});

export const updateWidgetSchema = z.object({ body: baseSchema.omit({
  userId: true,
  feePercentage: true,
}) });
export const updateWidgetParams = z.object({
  body: baseSchema
    .extend({
      feeWalletAddress: z.string().min(12, 'Please Add Fee wallet'),
      tokenId: z.string().min(12, 'Please select token'),
      website: z.string().url().optional(),
    })
    .omit({
      userId: true,
      feePercentage: true,
    }),
});
export const widgetIdSchema = z.object({
  body: baseSchema.pick({ id: true }),
});
export const widgetIdParamsSchema = z.object({
  params: baseSchema.pick({ id: true }),
});
// Types for widgets - used to type API request params and within Components
export type Widget = typeof widgets.$inferSelect;
export type NewWidget = z.infer<typeof insertWidgetSchema>;
export type NewWidgetParams = z.infer<typeof insertWidgetParams>['body'];
export type UpdateWidgetParams = z.infer<typeof updateWidgetParams>['body'];
export type WidgetId = z.infer<typeof widgetIdSchema>['body'];
