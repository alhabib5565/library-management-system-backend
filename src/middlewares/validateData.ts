import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';

export const validateData = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({ body: req.body }); //safeParseAsync error throw kore na, return kore result object
    if (!result.success) {
      next(result.error);
    } else {
      req.body = result.data.body;
      next();
    }
  };
};
