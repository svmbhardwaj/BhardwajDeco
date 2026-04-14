/**
 * Wraps an async route handler to auto-catch errors
 * and forward them to Express error middleware.
 * Eliminates try-catch boilerplate in every controller.
 *
 * Usage:
 *   router.get("/", asyncHandler(myController));
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create a custom API error with a status code.
 *
 * Usage:
 *   throw apiError(404, "Product not found");
 */
export function apiError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Standard API response envelope.
 * Ensures every response has a consistent shape.
 */
export function apiResponse(res, statusCode, data, meta = {}) {
  const response = {
    success: statusCode < 400,
    ...data,
    ...(Object.keys(meta).length > 0 && { meta })
  };
  return res.status(statusCode).json(response);
}
