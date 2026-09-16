import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendSuccessResponse from '../../utils/sendSuccessResponse';
import httpStatus from 'http-status';
import { userService } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createNewUser(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User created succesfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await userService.getAllUsers();

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: ' User retrieved succesfully',
    meta: meta,
    data: data,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.getUserById(id as string);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User retrieved succesfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.deleteUserById(id as string);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User deleted succesfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.updateUserById(id as string, req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User updated succesfully',
    data: result,
  });
});

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};
