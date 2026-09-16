import express from 'express';
import { userRoutes } from './modules/users/user.route';
import { authRoutes } from './modules/auth/auth.route';

const router = express();
router.use(
  '/users',
  //#swagger.tags = ['Users']
  userRoutes
);
router.use(
  '/auth',
  // #swagger.tags = ['Auth']
  authRoutes
);

export const appRoutes = router;
