import { env } from "../config/env.js";

/**
 * Centralized error handler middleware.
 * Classifies errors by type and returns clean, helpful HTTP responses.
 */
export function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = null;

  // ─── Mongoose Validation Error ───
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
  }

  // ─── Mongoose Duplicate Key Error ───
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for: ${field}. A record with this value already exists.`;
  }

  // ─── Mongoose Cast Error (invalid ObjectId etc.) ───
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: "${err.value}"`;
  }

  // ─── JWT Errors ───
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired. Please login again.";
  }

  // ─── Multer Errors ───
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    message = "File too large. Maximum size is 10MB.";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "Unexpected file field";
  }

  // ─── Log in development ───
  if (!env.isProduction) {
    console.error(`\n❌ [${req?.id || "N/A"}] ${statusCode} ${message}`);
    console.error(err.stack || err);
  } else {
    // Production: log minimal info
    console.error(`[${req?.id || "N/A"}] ${statusCode} ${message}`);
  }

  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(req?.id && { requestId: req.id }),
    ...(!env.isProduction && { stack: err.stack })
  };

  res.status(statusCode).json(response);
}
