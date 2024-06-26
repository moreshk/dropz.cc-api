import type { Router } from 'express';
import { createRouter } from '@/utils/create';
import { handelGetBlinkMetaData } from '@/controllers/blink-controllers';

export default createRouter((router: Router) => {
  router.get('/details/:id', handelGetBlinkMetaData);
  router.get('/action/buy/:id/:amount', handelGetBlinkMetaData);
  router.get('/action/sell/:id/:amount', handelGetBlinkMetaData);
});
