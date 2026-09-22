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

import { AppError } from '../../utils/appError';

import httpStatus from 'http-status';

// Register User
const registerUser = async (userData: IRegister) => {
  // 1. Check if email already exists
  const existingUser = await userRepository.findUserByEmail(userData.email);

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'Email already exists');
  }

  // 2. Hash password
  const hashedPassword = await hashPassword(userData.password);

  // 3. Create user
  const user = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  });

  return sanitizeUser(user);
};

// Login User
const loginUser = async (payload: ILogin) => {
  // 1. Find user by email
  const user = await userRepository.findUserByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // 2. Verify password
  const isPasswordValid = await comparePassword(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // 3. Check if user is active
  if (user.status !== USER_STATUS.ACTIVE) {
    throw new AppError(httpStatus.FORBIDDEN, 'Account is deactivated.');
  }

  // 4. Create JWT payload
  const jwtPayload: IJwtPayload = {
    id: user.user_id,
    email: user.email,
    role: user.role,
  };

  // 5. Generate tokens
  const access_token = authUtils.generateAccessToken(jwtPayload);

  const refresh_token = authUtils.generateRefreshToken(jwtPayload);

  return {
    access_token,
    refresh_token,
  };
};

// Forget Password
const forgetPassword = async (payload: IForgetPassword) => {
  // 1. Find user by email
  const user = await userRepository.findUserByEmail(payload.email);

  // Avoid revealing whether the email exists
  if (!user) {
    return {
      message: 'If email exists, you will receive a password reset link',
    };
  }

  // 2. Generate reset token
  const resetToken = authUtils.generateResetToken();

  // 3. Hash token before saving
  const hashedToken = authUtils.hashResetToken(resetToken);

  // 4. Calculate expiry time (15 minutes)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // 5. Save hashed token to database
  await authRepository.saveResetToken(user.user_id, hashedToken, expiresAt);

  // 6. Send password reset email
  await authUtils.sendPasswordResetEmail(user.email, resetToken);

  return {
    message: 'If email exists, you will receive a password reset link',
  };
};

// Reset Password
const resetPassword = async (payload: IResetPassword): Promise<{ message: string }> => {
  // 1. Hash token from URL
  const hashedToken = authUtils.hashResetToken(payload.token);

  // 2. Find valid token
  const tokenData = await authRepository.findValidResetToken(hashedToken);

  if (!tokenData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired reset token');
  }

  // 3. Hash new password
  const hashedPassword = await hashPassword(payload.newPassword);

  // 4. Update user password
  await authRepository.updateUserPassword(tokenData.user_id, hashedPassword);

  // 5. Delete reset token after successful use
  await authRepository.saveResetToken(tokenData.user_id, null, null);

  return {
    message: 'Password reset successful',
  };
};

// Change Password
const changePassword = async (userId: string, payload: IChangePassword) => {
  // 1. Find user
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // 2. Verify old password
  const isOldPasswordValid = await comparePassword(payload.oldPassword, user.password);

  if (!isOldPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
  }

  // 3. Check if new password is same as old
  const isSamePassword = await comparePassword(payload.newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'New password must be different from current password'
    );
  }

  // 4. Hash new password
  const hashedPassword = await hashPassword(payload.newPassword);

  // 5. Update password
  await authRepository.updateUserPassword(userId, hashedPassword);

  return {
    message: 'Password changed successfully',
  };
};

// Refresh Access Token
const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  // 1. Verify refresh token
  const decoded = authUtils.verifyRefreshToken(refreshToken);

  // 2. Check if user still exists
  const user = await userRepository.findUserById(decoded.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // 3. Check if user is active
  if (user.status !== USER_STATUS.ACTIVE) {
    throw new AppError(httpStatus.FORBIDDEN, 'Account is deactivated');
  }

  // 4. Generate new access token
  const jwtPayload: IJwtPayload = {
    id: user.user_id,
    email: user.email,
    role: user.role,
  };

  const accessToken = authUtils.generateAccessToken(jwtPayload);

  return {
    accessToken,
  };
};

export const authService = {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  refreshAccessToken,
};
