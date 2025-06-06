import { NextFunction, Request, Response } from 'express';
import ErrorResponse from './interfaces/ErrorResponse';
import { ZodError } from 'zod/v4';
import createHttpError from 'http-errors';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  if (createHttpError.isHttpError(err)) {
    res.status(err.status || 500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    })
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: err.message,
      issues: err.issues,
    })
    return;
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
