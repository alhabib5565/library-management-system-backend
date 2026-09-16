import * as authRepository from './auth.repository';
import { hashPassword, comparePassword, sanitizeUser } from '../users/user.utils';
import * as authUtils from './auth.utils';
import {
  IRegister,
  ILogin,
  IForgetPassword,
  IResetPassword,
  IChangePassword,
  IJwtPayload,
} from './auth.interface';
import { userRepository } from '../users/user.repository';
import { USER_STATUS } from '../users/user.constants';

const registerUser = async (userData: IRegister) => {
  // 1. Check if email already exists
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(userData.password);

  const user = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  });

  return sanitizeUser(user);
};

const loginUser = async (payload: ILogin) => {
  // 1. Find user by email
  const user = await userRepository.findUserByEmail(payload.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Verify password
  const isPasswordValid = await comparePassword(payload.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // 3. Check if user is active
  if (user.status != USER_STATUS.ACTIVE) {
    throw new Error('Account is deactivated. Please contact support');
  }

  const jwtPayload: IJwtPayload = {
    id: user.user_id,
    email: user.email,
    role: user.role,
  };

  const access_token = authUtils.generateAccessToken(jwtPayload);
  const refresh_token = authUtils.generateRefreshToken(jwtPayload);

  return { access_token, refresh_token };
};

const forgetPassword = async (payload: IForgetPassword) => {
  // 1. Find user by email
  const user = await userRepository.findUserByEmail(payload.email);
  if (!user) {
    return { message: 'If email exists, you will receive a password reset link' };
  }

  // 2. Generate reset token (random string)
  const resetToken = authUtils.generateResetToken();

  // 3. Hash token before saving (database leak হলেও token use করা যাবে না)
  const hashedToken = authUtils.hashResetToken(resetToken);

  // 4. Calculate expiry time (15 minutes from now)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // 5. Save hashed token to database
  await authRepository.saveResetToken(user.user_id, hashedToken, expiresAt);

  // 6. Send email with reset token (plain token - user এর কাছে)
  await authUtils.sendPasswordResetEmail(user.email, resetToken);

  return null;
};

const resetPassword = async (payload: IResetPassword): Promise<{ message: string }> => {
  // 1. Hash the token from URL (database এ hashed token saved আছে)
  const hashedToken = authUtils.hashResetToken(payload.token);

  // 2. Find valid token in database (এবং expire check)
  const tokenData = await authRepository.findValidResetToken(hashedToken);
  if (!tokenData) {
    throw new Error('Invalid or expired reset token');
  }

  // 3. Hash new password
  const hashedPassword = await hashPassword(payload.newPassword);

  // 4. Update user password
  await authRepository.updateUserPassword(tokenData.user_id, hashedPassword);

  // 5. Delete reset token (একবার use হলে আর use করা যাবে না)
  await authRepository.saveResetToken(tokenData.user_id, null, null);

  return { message: 'Password reset successful' };
};

const changePassword = async (userId: string, payload: IChangePassword) => {
  // 1. Find user
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 2. Verify old password
  const isOldPasswordValid = await comparePassword(payload.oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // 3. Check if new password is same as old (optional, but good UX)
  const isSamePassword = await comparePassword(payload.newPassword, user.password);
  if (isSamePassword) {
    throw new Error('New password must be different from current password');
  }

  // 4. Hash new password
  const hashedPassword = await hashPassword(payload.newPassword);

  // 5. Update password
  await authRepository.updateUserPassword(userId, hashedPassword);

  return { message: 'Password changed successfully' };
};

const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  // 1. Verify refresh token
  const decoded = authUtils.verifyRefreshToken(refreshToken);

  // 2. Check if user still exists and is active
  const user = await userRepository.findUserById(decoded.id);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.status != USER_STATUS.ACTIVE) {
    throw new Error('Account is deactivated');
  }

  // 3. Generate new access token
  const jwtPayload: IJwtPayload = {
    id: user.user_id,
    email: user.email,
    role: user.role,
  };
  const accessToken = authUtils.generateAccessToken(jwtPayload);

  return { accessToken };
};
export const authService = {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  refreshAccessToken,
};
