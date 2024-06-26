import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelGetBlinkMetaData, handelGetPaymentTransaction } from '@/controllers/blink-controllers';

export default createRouter((router: Router) => {
  router.get('/details/', handelGetBlinkMetaData);
  router.get('/details/:id', handelGetBlinkMetaData);
  router.get('/action/buy/:id/:amount', handelGetPaymentTransaction);
  router.get('/action/sell/:id/:amount', handelGetBlinkMetaData);
});
