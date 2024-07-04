import { z } from 'zod';
import { getLeaderBoard } from '@/services/leaderboard-services';
import { getAllTokensList } from '@/services/token-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export const handelGetLeaderBoard = createHandler(z.object({
  query: z.object({
    page: z.string().optional(),
  }),
}), async (req, res) => {
  const page = req.query.page;
  const leaderboard = await getLeaderBoard(page ? +page : 1);
  const tokens = await getAllTokensList();
  if (!leaderboard && !tokens)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ ...leaderboard, tokens });
});
