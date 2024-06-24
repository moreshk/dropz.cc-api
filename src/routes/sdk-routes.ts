import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelCreateReferral, handelGetBalance, handelGetReferral, handelGetSPLTokenBalance, handelGetSolBalance, handleGetSdkWidgetById } from '@/controllers/sdk-controllers';
import { handleGetAllToken } from '@/controllers/token-controllers';
import { authenticate } from '@/middlewares/auth';

export default createRouter((router: Router) => {
  router.get('/widget/tokens', handleGetAllToken);
  router.get('/wallet/balance/:id', handelGetBalance);
  router.get('/wallet/spl-token/:tokenAddress/balance/:splTokenAddress/:decimal', handelGetSPLTokenBalance);
  router.get('/wallet/sol/balance/:id', handelGetSolBalance);
  router.get('/referrals', authenticate(), handelGetReferral);
  router.post('/referral/create', authenticate(), handelCreateReferral);
  router.get('/widget/:id', handleGetSdkWidgetById);
});
