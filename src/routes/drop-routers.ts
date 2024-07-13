import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handleAddDrop, handleDeleteDrop, handleGetAllDrop } from '@/controllers/drop-controllers';
import { authenticate } from '@/middlewares/auth';

export default createRouter((router: Router) => {
  router.post('/add', authenticate({
    verifyAdmin: true,
  }), handleAddDrop);
  router.get('/all', handleGetAllDrop);
  router.post('/delete', handleDeleteDrop);
});
