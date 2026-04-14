import crypto from "crypto";

/**
 * Attaches a unique request ID to every incoming request.
 * Useful for log tracing, debugging, and correlating errors.
 */
export function requestId(req, res, next) {
  const id = crypto.randomUUID();
  req.id = id;
  res.setHeader("X-Request-Id", id);
  next();
}

/**
 * Logs response time for every request.
 * Sets X-Response-Time header before the response is sent.
 */
export function responseTime(req, res, next) {
  const start = process.hrtime.bigint();

  // Intercept writeHead to set the header BEFORE response is sent
  const originalWriteHead = res.writeHead;
  res.writeHead = function (...args) {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    // Only set if headers haven't been sent yet
    if (!res.headersSent) {
      res.setHeader("X-Response-Time", `${durationMs.toFixed(2)}ms`);
    }
    return originalWriteHead.apply(this, args);
  };

  next();
}
