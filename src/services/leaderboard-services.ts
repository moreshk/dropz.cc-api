import { count, desc } from 'drizzle-orm';
import { leaderboard } from '@/schema/leaderboard';
import { db } from '@/utils/db';

const PAGE_SIZE = 10;

export async function getLeaderBoard(page = 1) {
  const offset = (page - 1) * PAGE_SIZE;
  const leaderboardItems = await db.query.leaderboard.findMany({
    orderBy: [desc(leaderboard.updatedAt)],
    with: {
      token: true,
    },
    offset,
    limit: PAGE_SIZE,
  });
  const totalCount = await db.select({ count: count() }).from(leaderboard);

  return {
    leaderboard: leaderboardItems,
    totalCount: totalCount[0]?.count,
  };
}
