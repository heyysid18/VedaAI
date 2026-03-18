import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

// ── Typed App Error ───────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Error Handler Middleware ──────────────────────────────────────────────────

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError') {
    const mongoErr = err as unknown as { code: number; keyValue: Record<string, unknown> };
    if (mongoErr.code === 11000) {
      res.status(409).json({
        success: false,
        message: `Duplicate field value: ${JSON.stringify(mongoErr.keyValue)}`,
      });
      return;
    }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: 'Invalid resource ID' });
    return;
  }

  // Custom operational error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  // Unknown / unexpected error
  if (!env.isProduction) {
    console.error('❌  Unhandled error:', err);
  }

  res.status(500).json({
    success: false,
    message: env.isProduction ? 'Internal server error' : err.message,
    ...(env.isDevelopment && { stack: err.stack }),
  });
}
