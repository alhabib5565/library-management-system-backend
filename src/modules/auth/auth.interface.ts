import { IUser } from '../users/user.interface';

export interface IRegister extends IUser {}

export interface ILogin {
  email: string;
  password: string;
}

export interface IForgetPassword {
  email: string;
}

export interface IResetPassword {
  oldPassword: string;
  newPassword: string;
  token: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}
