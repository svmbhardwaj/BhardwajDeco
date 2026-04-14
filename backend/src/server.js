import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import xssClean from "xss-clean";

import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestId, responseTime } from "./middleware/requestMeta.js";

// ─── Route Imports ───
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import enquiriesRoutes from "./routes/enquiries.js";
import productsRoutes from "./routes/products.js";
import updatesRoutes from "./routes/updates.js";
import uploadsRoutes from "./routes/uploads.js";
import statsRoutes from "./routes/stats.js";

const app = express();

// ─── Trust proxy (if behind Nginx/Load Balancer) ───
if (env.isProduction) {
  app.set("trust proxy", 1);
}

// ─── Request Metadata ───
app.use(requestId);
app.use(responseTime);

// ─── Security Headers ───
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Allow frontend to load assets
  })
);

// ─── Request Logging ───
app.use(
  morgan(
    env.isProduction
      ? ":method :url :status :response-time ms - :remote-addr"
      : "dev"
  )
);

// ─── Response Compression ───
app.use(compression());

// ─── CORS ───
const allowedOrigins = [
  env.frontendUrl,
  "http://localhost:3000",
  "http://localhost:3001"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Total-Count", "X-Request-Id", "X-Response-Time"]
  })
);

// ─── Body Parsing ───
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── NoSQL Injection Prevention ───
app.use(mongoSanitize());

// ─── XSS Prevention ───
app.use(xssClean());

// ─── Rate Limiting ───
const apiLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});
app.use("/api/", apiLimiter);

// Stricter rate limit for auth endpoints (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 30 seconds."
  }
});
app.use("/api/auth/", authLimiter);

// Stricter rate limit for enquiry submissions (prevent spam)
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 enquiries per hour per IP
  message: {
    success: false,
    message: "Too many enquiries submitted. Please try again later."
  }
});
app.use("/api/enquiries", (req, _res, next) => {
  // Only rate-limit POST (submissions), not GET (admin listing)
  if (req.method === "POST") {
    return enquiryLimiter(req, _res, next);
  }
  next();
});

// ─── Health Check ───
app.get("/health", async (_req, res) => {
  const mongoose = (await import("mongoose")).default;

  res.json({
    success: true,
    status: "ok",
    app: "BhardwajDeco API",
    version: "2.0.0",
    environment: env.nodeEnv,
    uptime: `${Math.floor(process.uptime())}s`,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// ─── API Routes ───
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/updates", updatesRoutes);
app.use("/api/enquiries", enquiriesRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/stats", statsRoutes);

// ─── 404 Handler ───
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    requestId: req.id
  });
});

// ─── Centralized Error Handler ───
app.use(errorHandler);

// ─── Handle uncaught exceptions ───
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// ─── Bootstrap ───
async function bootstrap() {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`
┌─────────────────────────────────────────────┐
│                                             │
│   🚀  BhardwajDeco API v2.0.0              │
│                                             │
│   Environment:  ${env.nodeEnv.padEnd(28)}│
│   Port:         ${String(env.port).padEnd(28)}│
│   Frontend:     ${env.frontendUrl.padEnd(28)}│
│   Health:       http://localhost:${env.port}/health${" ".repeat(Math.max(0, 14 - String(env.port).length))}│
│                                             │
│   Features:                                 │
│   ✅ JWT Authentication                     │
│   ✅ ImageKit CDN                           │
│   ✅ Brevo Transactional Email              │
│   ✅ AI Description Enhancement             │
│   ✅ Rate Limiting & Security               │
│                                             │
└─────────────────────────────────────────────┘
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
