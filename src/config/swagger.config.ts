// swagger.ts
import swaggerAutogen from 'swagger-autogen';
import path from 'path';
import { userSchemas } from '../modules/users/user.swagger.schema';
import { authSchemas } from '../modules/auth/auth.swagger';
import { bookSchemas } from '../modules/books/book.swagger.schema';
const doc = {
  info: {
    title: 'Library Management System',
    version: '1.0.0',
    description: 'Library Management System API Documentation',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    schemas: {
      ...userSchemas,
      ...authSchemas,
      ...bookSchemas,
    },
    parameters: {
      Page: {
        name: 'page',
        in: 'query',
        required: false,
        schema: {
          type: 'integer',
          default: 1,
        },
      },

      Limit: {
        name: 'limit',
        in: 'query',
        required: false,
        schema: {
          type: 'integer',
          default: 10,
        },
      },

      Search: {
        name: 'search',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },

  tags: [
    { name: 'Auth', description: 'Authentication APIs' },
    { name: 'Users', description: 'User management APIs' },
  ],
};

const outputFile = path.resolve(process.cwd(), 'swagger-output.json');
const routes = ['../app.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
