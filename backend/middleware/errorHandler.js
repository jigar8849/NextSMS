/**
 * Centralized Error Handler Middleware
 * Provides consistent error responses and environment-aware error details
 */

const config = require('../config/env');

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Convert known errors to ApiError format
 */
const convertError = (err) => {
  let error = err;
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    error = new ApiError(400, message);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field} already exists`;
    error = new ApiError(409, message);
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ApiError(400, message);
  }
  
  // Passport UserExistsError
  if (err.name === 'UserExistsError') {
    error = new ApiError(409, 'User already exists with this email');
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }
  
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }
  
  return error;
};

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = convertError(err);
  
  // Default to 500 if not an ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  
  // Log error
  console.error('Error:', {
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  // Prepare response
  const response = {
    error: error.message,
    statusCode: error.statusCode
  };
  
  // Add stack trace in development mode
  if (config.isDevelopment) {
    response.stack = error.stack;
    response.originalError = err.message;
  }
  
  // Send response
  res.status(error.statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

/**
 * Async handler wrapper to catch async errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  ApiError,
  errorHandler,
  notFoundHandler,
  asyncHandler
};
