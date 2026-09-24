import httpStatus from 'http-status';

import { bookRepository } from './book.repository';
import { IBook, IBookQuery } from './book.interface';
import { AppError } from '../../utils/appError';

const createBook = async (data: IBook, userId: string) => {
  const existingBook = await bookRepository.getBookByISBN(data.isbn);

  if (existingBook) {
    throw new AppError(httpStatus.CONFLICT, 'A book with this ISBN already exists');
  }
  data.created_by = userId;
  const result = await bookRepository.createBook(data);

  return result;
};

const getAllBooks = async (query: IBookQuery) => {
  const { page = 1, limit = 10, search, status } = query;

  const [data, total] = await Promise.all([
    bookRepository.getAllBooks(query),

    bookRepository.countBooks({
      search,
      status,
    }),
  ]);

  const meta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return {
    data,
    meta,
  };
};

const getBookById = async (id: string) => {
  const result = await bookRepository.getBookById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }

  return result;
};

const updateBook = async (id: string, data: Partial<IBook>) => {
  const existingBook = await bookRepository.getBookById(id);

  if (!existingBook) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }

  // If ISBN is being updated,
  // make sure another book doesn't already have it.
  if (data.isbn && data.isbn !== existingBook.isbn) {
    const isbnExists = await bookRepository.getBookByISBN(data.isbn);

    if (isbnExists) {
      throw new AppError(httpStatus.CONFLICT, 'A book with this ISBN already exists');
    }
  }

  const result = await bookRepository.updateBook(id, data);

  return result;
};

const deleteBook = async (id: string) => {
  const existingBook = await bookRepository.getBookById(id);

  if (!existingBook) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }

  /*
   * Future:
   *
   * const hasCopies = await bookRepository.hasBookCopies(id);
   *
   * if (hasCopies) {
   *   throw new AppError(
   *     httpStatus.BAD_REQUEST,
   *     'Cannot delete a book that has copies',
   *   );
   * }
   */

  const result = await bookRepository.deleteBook(id);

  return result;
};

export const bookService = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
