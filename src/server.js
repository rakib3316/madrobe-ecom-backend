import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

// Handle uncaught exception (synchronous error like console.log(x))
process.on("uncaughtException", (error) => {
  console.log("😮 Uncaught exception is detected.");
  process.exit(1);
});

let server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url);
    console.log("✅ Database connected successfully! ✅");

    server = app.listen(config.port, () => {
      console.log(`😎 Application listening on ➡️  ${config.port}`);
    });
  } catch (error) {
    console.log("❌ Failed to connect database");
  }

  // Promise rejection (asynchronous error).
  process.on("unhandledRejection", (error) => {
    console.log("🤐 Unhandled rejection is detected, we are closing our server. 😴");
    if (server) {
      server.close(() => {
        // User logger for logging error in server.
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on("SIGTERM", () => {
  // Use logger for sending message.
  if (server) {
    server.close();
  }
});
