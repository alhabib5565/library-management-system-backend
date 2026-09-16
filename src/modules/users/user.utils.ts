import bcrypt from 'bcrypt';
import { IUser } from './user.interface';

// Password hash করা
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Password verify করা
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Response থেকে password remove করা
export const sanitizeUser = (user: IUser) => {
  const { password, ...sanitized } = user;
  console.log(password);
  return sanitized;
};

// Multiple users sanitize করা
export const sanitizeUsers = (users: IUser[]) => {
  return users.map((user) => sanitizeUser(user));
};
