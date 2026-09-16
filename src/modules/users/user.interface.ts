import { TUserRole, TUserStatus } from './user.constants';

export interface IUser {
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  status: TUserStatus;
  created_at: Date;
  updated_at: Date;
}
