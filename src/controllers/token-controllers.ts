import { insertTokenParams, tokenIdSchema, updateTokenParams } from '@/schema/tokens';
import type { User } from '@/schema/user';
import { addToken, deleteToken, getSwapTokens, getTokenById, getTokenMetadata, getUsersTokens, populateToken, updateToken } from '@/services/token-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export const handelAddNewToken = createHandler(insertTokenParams, async (req, res) => {
  const insertToken = req.body;
  const { user } = res.locals as { user: User };
  const addedToken = await addToken(insertToken, user.id);
  if (!addedToken)
    throw new BackendError('CONFLICT');

  res.status(200).json({ token: addedToken });
});

export const handleUpdateToken = createHandler(updateTokenParams, async (req, res) => {
  const { user } = res.locals as { user: User };
  const token = req.body;
  const updatedUser = await updateToken(token.id, token, user.id);
  res.status(200).json({
    user: updatedUser,
  });
});

export const handelGetTokenId = createHandler(tokenIdSchema, async (req, res) => {
  const { id } = req.body;
  const token = await getTokenById(id);
  if (!token)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ token });
});

export const handelGetTokenMetaData = createHandler(tokenIdSchema, async (req, res) => {
  const { id } = req.body;
  const metadata = await getTokenMetadata(id);
  if (!metadata)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ metadata });
});

export const handleGetAllToken = createHandler(async (req, res) => {
  const tokens = await getSwapTokens();
  res.status(200).json({ tokens });
});

export const handleGetUserToken = createHandler(async (req, res) => {
  const { user } = res.locals as { user: User };

  const tokens = await getUsersTokens(user.id);
  res.status(200).json({ tokens });
});

export const handlePopulateToken = createHandler(async (req, res) => {
  const { user } = res.locals as { user: User };

  const { success } = await populateToken(user.id);
  if (!success)
    throw new BackendError('BAD_REQUEST');
  res.status(200).json({ success });
});

export const handelDeleteToken = createHandler(tokenIdSchema, async (req, res) => {
  const { id } = req.body;
  const { user } = res.locals as { user: User };

  const token = await deleteToken(id, user.id);
  if (!token)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ token });
});
