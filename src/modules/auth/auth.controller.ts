import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendSuccessResponse from '../../utils/sendSuccessResponse';
import httpStatus from 'http-status';
import { authService } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Registration successful',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { access_token, refresh_token } = await authService.loginUser(req.body);

  res.cookie('refresh_token', refresh_token, {
    secure: false,
    httpOnly: true,
  });

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Login successful',
    data: { access_token },
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.forgetPassword(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset link sent successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset successful',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const userId = req.user.id;
  const result = await authService.changePassword(userId, req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refresh_token = req.cookies.refresh_token;
  console.log(refresh_token);
  const result = await authService.refreshAccessToken(refresh_token);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Access token refreshed successfully',
    data: result,
  });
});

export const authController = {
  register,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
  refreshToken,
};
