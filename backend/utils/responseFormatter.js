/**
 * Response Formatter Utility
 * Provides consistent response format across all endpoints
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 */
const sendSuccess = (res, statusCode = 200, message, data = {}) => {
  const response = {
    success: true,
    message,
    ...data
  };
  
  res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 */
const sendError = (res, statusCode = 500, message, details = null) => {
  const response = {
    success: false,
    error: message
  };
  
  if (details) {
    response.details = details;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Send created response (201)
 */
const sendCreated = (res, message, data = {}) => {
  sendSuccess(res, 201, message, data);
};

/**
 * Send no content response (204)
 */
const sendNoContent = (res) => {
  res.status(204).send();
};

/**
 * Send paginated response
 */
const sendPaginated = (res, data, page, limit, total) => {
  const response = {
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
  
  res.status(200).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
  sendCreated,
  sendNoContent,
  sendPaginated
};
