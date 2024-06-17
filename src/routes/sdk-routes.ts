import type { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';
import { handelGetBalance, handleGetSdkWidgetById } from '@/controllers/skd-controllers';

export default createRouter((router: Router) => {
  router.get('/widget/:id', handleGetSdkWidgetById);
  router.get('/wallet/balance/:id', handelGetBalance);
});
