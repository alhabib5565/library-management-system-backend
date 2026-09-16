import { AppError } from '../../utils/appError';
import { IUser } from './user.interface';
import { userRepository } from './user.repository';
import * as userUtils from './user.utils';

const createNewUser = async (userData: IUser) => {
  // 1. Check if email already exists
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // 2. Hash password
  const hashedPassword = await userUtils.hashPassword(userData.password);

  // 3. Create user in database
  const user = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  });

  // 4. Return sanitized user
  return userUtils.sanitizeUser(user);
};

const getUserById = async (id: string) => {
  const user = await userRepository.findUserById(id);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return userUtils.sanitizeUser(user);
};

const getAllUsers = async (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;

  // Get users and total count
  const [users, total] = await Promise.all([
    userRepository.findAllUsers(limit, offset),
    userRepository.countUsers(),
  ]);

  return {
    data: userUtils.sanitizeUsers(users),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update user
const updateUserById = async (id: string, userData: Partial<IUser>) => {
  // 1. Check if user exists
  const existingUser = await userRepository.findUserById(id);
  if (!existingUser) {
    throw new AppError(404, 'User not found');
  }

  // 2. If email is being updated, check if it's already taken
  if (userData.email && userData.email !== existingUser.email) {
    const emailExists = await userRepository.findUserByEmail(userData.email);
    if (emailExists) {
      throw new Error('Email already exists');
    }
  }

  // 3. Update user
  const updatedUser = await userRepository.updateUser(id, userData);

  if (!updatedUser) {
    throw new AppError(500, 'Update failed');
  }

  return userUtils.sanitizeUser(updatedUser);
};

// Delete user
const deleteUserById = async (id: string): Promise<{ message: string }> => {
  // 1. Check if user exists
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // 2. Delete user
  const deleted = await userRepository.deleteUser(id);

  if (!deleted) {
    throw new AppError(500, 'Delete failed');
  }

  return { message: 'User deleted successfully' };
};

export const userService = {
  createNewUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
};
