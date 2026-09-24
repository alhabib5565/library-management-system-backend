import { z } from 'zod';
import { BOOK_STATUS } from './book.constant';

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    author: z.string().min(2, 'Author must be at least 2 characters'),
    isbn: z.string().min(10, 'ISBN must be at least 10 characters'),
    image: z.string().url('Image must be a valid URL'),
    status: z
      .enum([BOOK_STATUS.ACTIVE, BOOK_STATUS.INACTIVE])
      .optional()
      .default(BOOK_STATUS.ACTIVE),
  }),
});

export const updateBookSchema = z.object({
  body: z
    .object({
      title: z.string().min(2, 'Title must be at least 2 characters').optional(),
      author: z.string().min(2, 'Author must be at least 2 characters').optional(),
      isbn: z.string().min(10, 'ISBN must be at least 10 characters').optional(),
      image: z.string().url('Image must be a valid URL').optional().nullable(),
      status: z.enum([BOOK_STATUS.ACTIVE, BOOK_STATUS.INACTIVE]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required to update the book',
    }),
});
