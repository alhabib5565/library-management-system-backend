import express from 'express';
import { userRoutes } from './modules/users/user.route';
import { authRoutes } from './modules/auth/auth.route';
import { bookRoutes } from './modules/books/book.route';

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
router.use(
  '/books',
  // #swagger.tags = ['Books']
  bookRoutes
);

export const appRoutes = router;
