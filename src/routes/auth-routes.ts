import type { Router } from 'express';
import { handleAddUser, handleUserLogin } from '@/controllers/user-controllers';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  // router.post('/sign-up', handleAddUser);
  router.post('/sign-in', handleUserLogin);
});
