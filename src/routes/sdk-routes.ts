import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelGetBalance, handelGetSPLTokenBalance, handelGetSolBalance, handleGetSdkReferralById, handleGetSdkUserReferralById, handleGetSdkWidgetById } from '@/controllers/sdk-controllers';
import { handleGetAllToken } from '@/controllers/token-controllers';

export default createRouter((router: Router) => {
  router.get('/widget/tokens', handleGetAllToken);
  router.get('/wallet/balance/:id', handelGetBalance);
  router.get('/wallet/spl-token/:tokenAddress/balance/:splTokenAddress/:decimal', handelGetSPLTokenBalance);
  router.get('/wallet/sol/balance/:id', handelGetSolBalance);
  router.get('/widget/:id', handleGetSdkWidgetById);
  router.get('/user-referral/:id', handleGetSdkUserReferralById);
  router.get('/referral/:id', handleGetSdkReferralById);
});
