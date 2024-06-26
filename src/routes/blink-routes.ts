import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelDefaultGetBlinkData, handelGetBlinkMetaData, handelGetDefaultBuyTransaction, handelGetDefaultSellTransaction, handelGetPaymentTransaction } from '@/controllers/blink-controllers';

export default createRouter((router: Router) => {
  router.get('/details', handelDefaultGetBlinkData);
  router.post('/action/buy/default/:amount', handelGetDefaultBuyTransaction);
  // router.post('/action/sell/default/:amount', handelGetDefaultSellTransaction);
  router.get('/details/:id', handelGetBlinkMetaData);
  router.get('/action/buy/:id/:amount', handelGetPaymentTransaction);
  router.get('/action/sell/:id/:amount', handelGetBlinkMetaData);
});
