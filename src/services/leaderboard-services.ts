import { desc } from 'drizzle-orm';
import { leaderboard } from '@/schema/leaderboard';
import { db } from '@/utils/db';

export async function getLeaderBoard() {
  return await db.query.leaderboard.findMany({
    orderBy: [
      desc(leaderboard.points),
      desc(leaderboard.createdAt),
    ],
    with: {
      token: true,
    },
  });
}
