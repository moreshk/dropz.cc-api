import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelDefaultGetBlinkData, handelGetBlinkMetaData, handelGetDefaultBuyTransaction, handelGetPaymentTransaction } from '@/controllers/blink-controllers';

export default createRouter((router: Router) => {
  router.get('/details', handelDefaultGetBlinkData);
  router.post('/action/buy/default/:amount', handelGetDefaultBuyTransaction);
  router.get('/action/sell/default/:amount', handelGetDefaultBuyTransaction);
  router.get('/details/:id', handelGetBlinkMetaData);
  router.get('/action/buy/:id/:amount', handelGetPaymentTransaction);
  router.get('/action/sell/:id/:amount', handelGetBlinkMetaData);
});
