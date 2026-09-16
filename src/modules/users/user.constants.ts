export const USER_ROLE = {
  ADMIN: 'Admin',
  LIBRARIAN: 'Librarian',
} as const;

export const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const;

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
