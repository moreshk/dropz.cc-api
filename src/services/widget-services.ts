import { and, eq } from 'drizzle-orm';
import { type NewWidgetParams, type UpdateWidgetParams, insertWidgetSchema, updateWidgetSchema, widgets } from '@/schema/widgets';
import { db } from '@/utils/db';

export async function addWidget(widget: NewWidgetParams, userId: string) {
  const [addWidget] = await db.insert(widgets).values({ ...widget, userId }).returning();
  return addWidget;
}

export async function updateWidget(widgetId: string, widget: UpdateWidgetParams, userId: string) {
  const [updatedWidget] = await db
    .update(widgets)
    .set({ ...widget, feePercentage: undefined, updatedAt: new Date() })
    .where(and(eq(widgets.id, widgetId), eq(widgets.userId, userId!)))
    .returning();
  return updatedWidget;
}

export async function deleteWidget(widgetId: string, userId: string) {
  const [widgetDeleted] = await db
    .delete(widgets)
    .where(and(eq(widgets.id, widgetId), eq(widgets.userId, userId)))
    .returning();
  return widgetDeleted;
}

export async function getWidgets(userId: string) {
  return await db.query.widgets.findMany({
    where: eq(widgets.userId, userId),
    with: {
      token: true,
    },
  });
}

export async function getWidgetById(widgetId: string) {
  return await db.query.widgets.findFirst({
    where: eq(widgets.id, widgetId),
    with: {
      token: true,
    },
  });
}
