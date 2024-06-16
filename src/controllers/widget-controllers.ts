import type { User } from '@/schema/user';
import { insertWidgetParams, updateWidgetParams, widgetIdSchema } from '@/schema/widgets';
import { addWidget, deleteWidget, getWidgetById, getWidgets, updateWidget } from '@/services/widget-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export const handelAddNewWidget = createHandler(insertWidgetParams, async (req, res) => {
  const insertWidget = req.body;
  const { user } = res.locals as { user: User };
  const widgetAdd = await addWidget(insertWidget, user.id);
  if (!widgetAdd)
    throw new BackendError('CONFLICT');
  res.status(200).json({ widget: widgetAdd });
});

export const handleUpdatedWidget = createHandler(updateWidgetParams, async (req, res) => {
  const insertWidget = req.body;
  const { user } = res.locals as { user: User };
  const widgetAdd = await updateWidget(insertWidget.id, insertWidget, user.id);
  if (!widgetAdd)
    throw new BackendError('CONFLICT');
  res.status(200).json({ widget: widgetAdd });
});

export const handleDeleteWidget = createHandler(widgetIdSchema, async (req, res) => {
  const { id } = req.body;
  const { user } = res.locals as { user: User };
  const deletedWidget = await deleteWidget(id, user.id);
  res.status(200).json({ widget: deletedWidget });
});

export const handleGetWidgetById = createHandler(widgetIdSchema, async (req, res) => {
  const { id } = req.body;
  const widget = await getWidgetById(id);
  if (!widget)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ widget });
});

export const handleGetWidgets = createHandler(async (req, res) => {
  const { user } = res.locals as { user: User };
  const widgets = await getWidgets(user.id);
  if (!widgets)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ widgets });
});
