import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelGetLeaderBoard } from '@/controllers/leaderboard-controllers';

export default createRouter((router: Router) => {
  router.get('/', handelGetLeaderBoard);
});
