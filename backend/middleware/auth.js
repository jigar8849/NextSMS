/**
 * Authentication Middleware
 * Handles authentication and authorization for different user types
 */

const { MODEL_NAMES } = require('../config/constants');
const { ApiError } = require('./errorHandler');

/**
 * Middleware to authenticate residents
 * Checks if user is logged in and is a resident
 */
const authenticateResident = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new ApiError(401, 'Authentication required. Please log in.'));
  }
  
  if (req.user.constructor.modelName !== MODEL_NAMES.RESIDENT) {
    return next(new ApiError(403, 'Access forbidden. Resident access required.'));
  }
  
  return next();
};

/**
 * Middleware to authenticate admins (society admins)
 * Checks if user is logged in and is a society admin
 */
const authenticateAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new ApiError(401, 'Authentication required. Please log in as admin.'));
  }
  
  if (req.user.constructor.modelName !== MODEL_NAMES.SOCIETY) {
    return next(new ApiError(403, 'Access forbidden. Admin access required.'));
  }
  
  return next();
};

/**
 * Optional authentication middleware
 * Allows route to work with or without authentication
 * Sets req.user if authenticated, but doesn't fail if not
 */
const optionalAuth = (req, res, next) => {
  // If authenticated, user is already available via passport
  // If not authenticated, just continue
  return next();
};

/**
 * Middleware to check if user is authenticated (any type)
 * Used for routes that work for both admin and resident
 */
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new ApiError(401, 'Authentication required. Please log in.'));
  }
  return next();
};

module.exports = {
  authenticateResident,
  authenticateAdmin,
  optionalAuth,
  isAuthenticated,
};
