export const BOOK_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type TBookStatus = (typeof BOOK_STATUS)[keyof typeof BOOK_STATUS];
