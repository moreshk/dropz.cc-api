import type { Router } from 'express';
import { handleGetUser, handleUpdateUser } from '@/controllers/user-controllers';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.get('/', authenticate(), handleGetUser);
  router.put('/update', authenticate(), handleUpdateUser);
});
