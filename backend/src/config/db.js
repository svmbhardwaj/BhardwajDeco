import mongoose from "mongoose";
import { env } from "./env.js";

let listenersRegistered = false;

export async function connectDB() {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return mongoose.connection;
  }

  if (!listenersRegistered) {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    listenersRegistered = true;
  }

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

  return mongoose.connection;
}
