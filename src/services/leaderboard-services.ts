import { leaderboard } from '@/schema/leaderboard';
import { db } from '@/utils/db';

export async function getLeaderBoard() {
  return await db.query.leaderboard.findMany({
    with: {
      token: true,
    },
  });
}
