import type { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';
import { handelGetReferral } from '@/controllers/referral-controllers';

export default createRouter((router: Router) => {
  router.get('/', authenticate({
    verifyAdmin: true,
  }), handelGetReferral);
});
