import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelDefaultGetBlinkData, handelGetBlinkMetaData, handelGetDefaultBuyTransaction, handelGetPaymentTransaction } from '@/controllers/blink-controllers';

export default createRouter((router: Router) => {
  router.get('/details', handelDefaultGetBlinkData);
  router.post('/action/buy/default/:amount', handelGetDefaultBuyTransaction);
  router.get('/details/:id', handelGetBlinkMetaData);
  router.post('/action/buy/:id/:amount', handelGetPaymentTransaction);
});
