import { Router } from 'express';
import { validateData } from '../../middlewares/validateData';
import { authController } from './auth.controller';
import {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validation';

const router = Router();

router.post('/register', validateData(registerSchema), authController.register);
router.post('/login', validateData(loginSchema), authController.login);
router.post('/forget-password', validateData(forgetPasswordSchema), authController.forgetPassword);
router.post('/reset-password', validateData(resetPasswordSchema), authController.resetPassword);
router.post(
  '/change-password',
  //auth,
  validateData(changePasswordSchema),
  authController.changePassword
);
router.post('/refresh-token', authController.refreshToken);

export const authRoutes = router;
