import { Request, Response } from 'express';

import httpStatus from 'http-status';

import catchAsync from '../../utils/catchAsync';
import sendSuccessResponse from '../../utils/sendSuccessResponse';

import { bookService } from './book.service';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.createBook(req.body, req.user.user_id);

  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Book created successfully',
    data: result,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await bookService.getAllBooks(req.query);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Books retrieved successfully',
    meta,
    data,
  });
});

const getBookById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await bookService.getBookById(id as string);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Book retrieved successfully',
    data: result,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await bookService.updateBook(id as string, req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Book updated successfully',
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await bookService.deleteBook(id as string);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Book deleted successfully',
    data: result,
  });
});

export const bookController = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
