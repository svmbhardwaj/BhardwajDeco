/**
 * Development startup script that uses MongoDB Memory Server.
 * No local MongoDB installation required.
 *
 * Usage: node src/dev.js
 */
import { MongoMemoryServer } from "mongodb-memory-server";

async function startDev() {
  console.log("🔧 Starting in-memory MongoDB...");
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Set the URI before anything else imports env
  process.env.MONGO_URI = uri;
  console.log(`✅ In-memory MongoDB running at ${uri}\n`);

  // Now start the actual server
  await import("./server.js");

  // Seed demo content into the in-memory database so the frontend can use the API directly.
  const { seedDatabase } = await import("./seed/seedData.js");
  await seedDatabase({ exitOnComplete: false });
}

startDev().catch((err) => {
  console.error("Failed to start dev server:", err);
  process.exit(1);
});
