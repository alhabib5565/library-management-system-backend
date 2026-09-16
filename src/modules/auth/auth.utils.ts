// ==========================================
// 3. auth.utils.ts
// কেন: JWT এবং email related helper functions
// ==========================================

import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from './auth.interface';
import crypto from 'crypto';
import config from '../../config/config';

export const generateToken = (
  payload: IJwtPayload,
  secret: string,
  options: SignOptions
): string => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string, secret: string): IJwtPayload => {
  try {
    return jwt.verify(token, secret) as IJwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
export const generateAccessToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);
};

export const generateRefreshToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  try {
    return jwt.verify(token, config.JWT_ACCESS_SECRET) as IJwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): IJwtPayload => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as IJwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const hashResetToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Email send করার mock function (real implementation এ nodemailer use করবে)
// কেন এই নাম: "sendEmail" = কি করছে তা clear
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
  // Real implementation এ nodemailer দিয়ে email send করবে
  const resetUrl = `${'http://localhost:3000'}/reset-password?token=${resetToken}`;

  console.log(`
    ========================================
    📧 PASSWORD RESET EMAIL
    ========================================
    To: ${email}
    Reset URL: ${resetUrl}
    Token expires in: ${config.RESET_TOKEN_EXPIRES_IN}
    ========================================
  `);

  // TODO: Real email sending logic
  /*
  const transporter = nodemailer.createTransport({...});
  await transporter.sendMail({
    from: config.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `<a href="${resetUrl}">Reset Password</a>`
  });
  */
};
