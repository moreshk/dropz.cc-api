import { widgetIdParamsSchema } from '@/schema/widgets';
import { getBalance, getSPLTokenBalance, getSolBalance, splTokenBalanceSchema } from '@/services/sdk-services';
import { getAllTokens } from '@/services/token-services';
import { getWidgetById } from '@/services/widget-services';
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
  const { splTokenAddress, tokenAddress } = req.params;
  const balance = await getSPLTokenBalance(splTokenAddress, tokenAddress);
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
