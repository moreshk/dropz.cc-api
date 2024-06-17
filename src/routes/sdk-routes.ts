import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelGetBalance, handelGetSPLTokenBalance, handelGetSolBalance, handleGetSdkWidgetById } from '@/controllers/sdk-controllers';

export default createRouter((router: Router) => {
  router.get('/widget/:id', handleGetSdkWidgetById);
  router.get('/wallet/balance/:id', handelGetBalance);
  router.get('/wallet/spl-token/:tokenAddress/balance/:id', handelGetSPLTokenBalance);
  router.get('/wallet/sol/balance/:id', handelGetSolBalance);
});
