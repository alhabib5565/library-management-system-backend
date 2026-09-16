import express, { Application, Request, Response, NextFunction } from 'express';
import { appRoutes } from './routes';
import sendSuccessResponse from './utils/sendSuccessResponse';
import cookie_parser from 'cookie-parser';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger-output.json';

// Create Express app
const app: Application = express();
// JSON body parser
app.use(express.json());
app.use(cookie_parser());

// ========================================
// ROUTES
// ========================================

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
  sendSuccessResponse(res, {
    statusCode: 200,
    message: 'Server is running',
    data: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1', appRoutes);

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler - কোন route match না করলে
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
