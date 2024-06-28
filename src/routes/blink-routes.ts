import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelGetBlinkMetaData, handelGetPaymentTransaction, handelGetRefBlinkMetaData, handelGetRefPaymentTransaction } from '@/controllers/blink-controllers';

export default createRouter((router: Router) => {
  router.get('/details/ref/:id', handelGetRefBlinkMetaData);
  router.post('/action/ref/buy/:id/:amount', handelGetRefPaymentTransaction);
  router.get('/details/:id', handelGetBlinkMetaData);
  router.post('/action/buy/:id/:amount', handelGetPaymentTransaction);
});
