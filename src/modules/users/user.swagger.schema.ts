import { USER_ROLE, USER_STATUS } from '../../modules/users/user.constants';
import { ref, createSuccessResponseSchema } from '../../utils/createSuccessResponseSchema';

const userBaseFields = {
  $name: 'Rahim Uddin',
  $email: 'rahim@gmail.com',
  role: USER_ROLE.LIBRARIAN,
};
const user = {
  $user_id: '1',

  ...userBaseFields,

  status: USER_STATUS.ACTIVE,
  created_at: '2023-07-01T10:00:00.000Z',
  updated_at: '2023-07-01T10:00:00.000Z',
};
export const userSchemas = {
  User: user,
  UserListData: [user],

  // -------------------------
  // Requests
  // -------------------------

  CreateUser: {
    ...userBaseFields,
    $password: '12345678',
  },

  UpdateUser: {
    name: 'Rahim Uddin',
    email: 'rahim@gmail.com',
    role: USER_ROLE.LIBRARIAN,
    status: 'Active',
  },

  // Responses
  CreateUserResponse: createSuccessResponseSchema(ref('User'), {
    statusCode: 201,
    message: 'User created successfully',
  }),
  UpdateUserResponse: createSuccessResponseSchema(ref('User'), {
    statusCode: 200,
    message: 'User updated successfully',
  }),
  UserResponse: createSuccessResponseSchema(ref('User'), {
    message: 'User retrieved successfully',
  }),
  UserListResponse: createSuccessResponseSchema(ref('UserListData'), {
    message: 'Users retrieved successfully',
    meta: true,
  }),
};
