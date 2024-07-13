import type { Router } from 'express';
import adminRoutes from '@/routes/admin-routes';
import userRoutes from '@/routes/user-routes';
import tokenRoutes from '@/routes/token-routes';
import auth from '@/routes/auth-routes';
import widgetRoutes from '@/routes/widget-routes';
import { createRouter } from '@/utils/create';
import sdkRouters from '@/routes/sdk-routes';
import blinkRoutes from '@/routes/blink-routes';
import referralRouter from '@/routes/referral-routes';
import leaderBoardRouter from '@/routes/leaderboard-routes';
import dropRouters from '@/routes/drop-routers';

export default createRouter((router: Router) => {
  router.use('/admin', adminRoutes);
  router.use('/user', userRoutes);
  router.use('/token', tokenRoutes);
  router.use('/widget', widgetRoutes);
  router.use('/auth', auth);
  router.use('/sdk', sdkRouters);
  router.use('/blink', blinkRoutes);
  router.use('/referral', referralRouter);
  router.use('/leaderBoard', leaderBoardRouter);
  router.use('/drop', dropRouters);
});
