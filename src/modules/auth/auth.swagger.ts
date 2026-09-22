import { ref, createSuccessResponseSchema } from '../../utils/createSuccessResponseSchema';

const authUser = {
  $user_id: '1',
  $name: 'Rahim Uddin',
  $email: 'rahim@gmail.com',
  role: 'Librarian',
  status: 'Active',
  created_at: '2023-07-01T10:00:00.000Z',
  updated_at: '2023-07-01T10:00:00.000Z',
};

export const authSchemas = {
  Login: {
    $email: 'rahim@gmail.com',
    $password: '12345678',
  },

  ForgetPassword: {
    $email: 'rahim@gmail.com',
  },

  ResetPassword: {
    $token: 'reset-token-here',
    $newPassword: '12345678',
  },

  ChangePassword: {
    $oldPassword: 'oldpassword',
    $newPassword: 'newpassword',
  },

  // Data
  AuthUser: authUser,

  AccessToken: {
    $access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },

  LoginResponse: createSuccessResponseSchema(ref('AccessToken'), {
    statusCode: 200,
    message: 'Login successful',
  }),

  ForgetPasswordResponse: createSuccessResponseSchema(
    { type: 'null' },
    {
      statusCode: 200,
      message: 'Password reset link sent successfully',
    }
  ),

  ResetPasswordResponse: createSuccessResponseSchema(
    { type: 'null' },
    {
      statusCode: 200,
      message: 'Password reset successful',
    }
  ),

  ChangePasswordResponse: createSuccessResponseSchema(
    { type: 'null' },
    {
      statusCode: 200,
      message: 'Password changed successfully',
    }
  ),

  RefreshTokenResponse: createSuccessResponseSchema(ref('AccessToken'), {
    statusCode: 200,
    message: 'Access token refreshed successfully',
  }),
};
