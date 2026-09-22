import { Router } from 'express';
import { validateData } from '../../middlewares/validateData';
import { authController } from './auth.controller';
import {
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validation';

const router = Router();

// Login
router.post(
  '/login',
  validateData(loginSchema),
  authController.login
  /*
    #swagger.security = []

    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/Login" }
    }

    #swagger.responses[200] = {
      schema: { $ref: "#/components/schemas/LoginResponse" }
    }
  */
);

// Forget Password
router.post(
  '/forget-password',
  validateData(forgetPasswordSchema),
  authController.forgetPassword
  /*
    #swagger.security = []

    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/ForgetPassword" }
    }

    #swagger.responses[200] = {
      schema: { $ref: "#/components/schemas/ForgetPasswordResponse" }
    }
  */
);

// Reset Password
router.post(
  '/reset-password',
  validateData(resetPasswordSchema),
  authController.resetPassword
  /*
    #swagger.security = []

    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/ResetPassword" }
    }

    #swagger.responses[200] = {
      schema: { $ref: "#/components/schemas/ResetPasswordResponse" }
    }
  */
);

// Change Password
router.post(
  '/change-password',
  // auth,
  validateData(changePasswordSchema),
  authController.changePassword
  /*
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/ChangePassword" }
    }

    #swagger.responses[200] = {
      schema: { $ref: "#/components/schemas/ChangePasswordResponse" }
    }
  */
);

// Refresh Token
router.post(
  '/refresh-token',
  authController.refreshToken
  /*
    #swagger.security = []

    #swagger.responses[200] = {
      schema: { $ref: "#/components/schemas/RefreshTokenResponse" }
    }
  */
);

export const authRoutes = router;

// Register
// router.post(
//   '/register',
//   validateData(registerSchema),
//   authController.register
//   /*
//     #swagger.security = []

//     #swagger.requestBody = {
//       required: true,
//       schema: { $ref: "#/components/schemas/Register" }
//     }

//     #swagger.responses[201] = {
//       schema: { $ref: "#/components/schemas/RegisterResponse" }
//     }
//   */
// );
