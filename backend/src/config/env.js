import dotenv from "dotenv";

dotenv.config();

export const env = {
  // ─── Server ───
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  isProduction: process.env.NODE_ENV === "production",

  // ─── Database ───
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/bhardwajdeco",

  // ─── Frontend ───
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // ─── Auth ───
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "admin@bhardwajdeco.com",
  adminPassword: process.env.ADMIN_PASSWORD || "BhardwajDeco@2026!",

  // ─── ImageKit ───
  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  imagekitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",

  // ─── Brevo (Email) ───
  brevoSmtpHost: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  brevoSmtpPort: Number(process.env.BREVO_SMTP_PORT || 587),
  brevoSmtpUser: process.env.BREVO_SMTP_USER || "",
  brevoSmtpKey: process.env.BREVO_SMTP_KEY || "",
  brevoSenderName: process.env.BREVO_SENDER_NAME || "BhardwajDeco",
  brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || "no-reply@bhardwajdeco.com",
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || "",

  // ─── AI Enhancement ───
  openaiApiKey: process.env.OPENAI_API_KEY || "",

  // ─── Security ───
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 100)
};
