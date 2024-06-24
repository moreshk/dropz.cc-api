import type { User } from '@/schema/user';
import { insertUserWidgetParams, widgetIdParamsSchema } from '@/schema/widgets';
import { getBalance, getSPLTokenBalance, getSolBalance, splTokenBalanceSchema } from '@/services/sdk-services';
import { getAllTokens } from '@/services/token-services';
import { addWidget, getWidgetById, getWidgets } from '@/services/widget-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export const handleGetSdkWidgetById = createHandler(widgetIdParamsSchema, async (req, res) => {
  const { id } = req.params;
  const widget = await getWidgetById(id);
  const tokens = await getAllTokens();
  if (!widget || !tokens)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ widget, tokens });
});

export const handelGetBalance = createHandler(widgetIdParamsSchema, async (req, res) => {
  const { id } = req.params;
  const balance = await getBalance(id);
  if (!balance)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ ...balance });
});

export const handelGetSPLTokenBalance = createHandler(splTokenBalanceSchema, async (req, res) => {
  const { splTokenAddress, tokenAddress, decimal } = req.params;
  const balance = await getSPLTokenBalance(splTokenAddress, tokenAddress, decimal);
  if (!balance)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ ...balance });
});

export const handelGetSolBalance = createHandler(widgetIdParamsSchema, async (req, res) => {
  const { id } = req.params;
  const balance = await getSolBalance(id);
  if (!balance)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ ...balance });
});

export const handelCreateReferral = createHandler(insertUserWidgetParams, async (req, res) => {
  const insertWidget = req.body;
  const { user } = res.locals as { user: User };
  const widgetAdd = await addWidget({ ...insertWidget, website: 'https://dropz.cc/' }, user.id);
  if (!widgetAdd)
    throw new BackendError('CONFLICT');
  res.status(200).json({ widget: widgetAdd });
});

export const handelGetReferral = createHandler(async (req, res) => {
  const { user } = res.locals as { user: User };
  const widgets = await getWidgets(user.id);
  if (!widgets)
    throw new BackendError('CONFLICT');
  res.status(200).json({ widgets });
});
