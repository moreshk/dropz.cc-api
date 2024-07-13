import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handleAddDrop, handleGetAllDrop } from '@/controllers/drop-controllers';
import { authenticate } from '@/middlewares/auth';
import { handelDeleteToken } from '@/controllers/token-controllers';

export default createRouter((router: Router) => {
  router.post('/add', authenticate({
    verifyAdmin: true,
  }), handleAddDrop);
  router.get('/all', handleGetAllDrop);
  router.post('/delete', handelDeleteToken);
});
