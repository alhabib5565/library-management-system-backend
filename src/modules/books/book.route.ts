import { Router } from 'express';

import { validateData } from '../../middlewares/validateData';

import { bookController } from './book.controller';
import { createBookSchema, updateBookSchema } from './book.validation';

import { USER_ROLE } from '../users/user.constants';
import auth from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.LIBRARIAN),
  validateData(createBookSchema),
  bookController.createBook
  /*
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/components/schemas/CreateBook" }
  }

  #swagger.responses[201] = {
    schema: { $ref: "#/components/schemas/CreateBookResponse" }
  }
  */
);

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.LIBRARIAN),
  bookController.getAllBooks
  /*
  #swagger.parameters['$ref'] = [
    '#/components/parameters/Page',
    '#/components/parameters/Limit',
    '#/components/parameters/Search',
    '#/components/parameters/Status'
  ]

  #swagger.responses[200] = {
    schema: { $ref: "#/components/schemas/BookListResponse" }
  }
  */
);

router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.LIBRARIAN),
  bookController.getBookById
  /*
  #swagger.responses[200] = {
    schema: { $ref: "#/components/schemas/BookResponse" }
  }
  */
);

router.put(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.LIBRARIAN),
  validateData(updateBookSchema),
  bookController.updateBook
  /*
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/components/schemas/UpdateBook" }
  }

  #swagger.responses[200] = {
    schema: { $ref: "#/components/schemas/UpdateBookResponse" }
  }
  */
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  bookController.deleteBook
  /*
  #swagger.responses[200] = {
    schema: { $ref: "#/components/schemas/DeleteBookResponse" }
  }
  */
);

export const bookRoutes = router;
