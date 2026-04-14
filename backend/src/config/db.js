import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

  await mongoose.connect(env.mongoUri, {
    autoIndex: !env.isProduction
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n${signal} received — closing MongoDB connection…`);
    await mongoose.connection.close();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
