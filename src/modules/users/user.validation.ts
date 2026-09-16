import { z } from 'zod';
import { USER_ROLE } from './user.constants';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    role: z.enum(USER_ROLE).optional().default(USER_ROLE.LIBRARIAN),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(USER_ROLE).optional(),
    is_active: z.boolean().optional(),
  }),
});
