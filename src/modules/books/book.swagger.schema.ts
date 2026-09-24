import { ref, createSuccessResponseSchema } from '../../utils/createSuccessResponseSchema';
import { BOOK_STATUS } from './book.constant';

const bookBaseFields = {
  $title: 'Clean Code',
  $author: 'Robert C. Martin',
  $isbn: '9780132350884',
  image: 'https://example.com/images/clean-code.jpg',
};

const book = {
  $book_id: '1',

  ...bookBaseFields,

  created_by: '1',
  status: BOOK_STATUS.ACTIVE,
  created_at: '2026-09-24T10:00:00.000Z',
  updated_at: '2026-09-24T10:00:00.000Z',
};

export const bookSchemas = {
  Book: book,
  BookListData: [book],

  // -------------------------
  // Requests
  // -------------------------

  CreateBook: {
    ...bookBaseFields,
    status: BOOK_STATUS.ACTIVE,
  },

  UpdateBook: {
    title: 'Clean Code - 2nd Edition',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    image: 'https://example.com/images/clean-code-2.jpg',
    status: BOOK_STATUS.ACTIVE,
  },

  // -------------------------
  // Responses
  // -------------------------

  CreateBookResponse: createSuccessResponseSchema(ref('Book'), {
    statusCode: 201,
    message: 'Book created successfully',
  }),

  UpdateBookResponse: createSuccessResponseSchema(ref('Book'), {
    statusCode: 200,
    message: 'Book updated successfully',
  }),

  BookResponse: createSuccessResponseSchema(ref('Book'), {
    message: 'Book retrieved successfully',
  }),

  BookListResponse: createSuccessResponseSchema(ref('BookListData'), {
    message: 'Books retrieved successfully',
    meta: true,
  }),

  DeleteBookResponse: createSuccessResponseSchema(ref('Book'), {
    message: 'Book deleted successfully',
  }),
};
