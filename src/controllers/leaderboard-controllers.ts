import { getLeaderBoard } from '@/services/leaderboard-services';
import { getAllTokensList } from '@/services/token-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export const handelGetLeaderBoard = createHandler(async (req, res) => {
  const leaderboard = await getLeaderBoard();
  const tokens = await getAllTokensList();

  if (!leaderboard && !tokens)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ leaderboard, tokens });
});
