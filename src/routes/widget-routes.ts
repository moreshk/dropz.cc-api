import type { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';
import { handelAddNewWidget, handleDeleteWidget, handleGetWidgets, handleUpdatedWidget } from '@/controllers/widget-controllers';

export default createRouter((router: Router) => {
  router.get('/', authenticate({ verifyAdmin: true }), handleGetWidgets);
  router.post('/create', authenticate({ verifyAdmin: true }), handelAddNewWidget);
  router.post('/update', authenticate({ verifyAdmin: true }), handleUpdatedWidget);
  router.post('/delete', authenticate({ verifyAdmin: true }), handleDeleteWidget);
});
