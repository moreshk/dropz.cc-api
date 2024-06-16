import type { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';
import { handelAddNewToken, handelDeleteToken, handelGetTokenId, handelGetTokenMetaData, handleGetAllToken, handleGetUserToken, handlePopulateToken, handleUpdateToken } from '@/controllers/token-controllers';

export default createRouter((router: Router) => {
  router.get('/all', handleGetAllToken);
  router.get('/', authenticate({ verifyAdmin: true }), handleGetUserToken);
  router.post('/delete', authenticate({ verifyAdmin: true }), handelDeleteToken);
  router.post('/create', authenticate({ verifyAdmin: true }), handelAddNewToken);
  router.put('/update', authenticate({ verifyAdmin: true }), handleUpdateToken);
  router.get('/populate', authenticate({ verifyAdmin: true }), handlePopulateToken);
  router.post('/metadata', authenticate({ verifyAdmin: true }), handelGetTokenMetaData);
  router.get('/:tokenId', authenticate(), handelGetTokenId);
});
