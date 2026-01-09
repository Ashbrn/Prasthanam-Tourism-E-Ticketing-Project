import dotenv from "dotenv";
const result = dotenv.config();
console.log("Dotenv config result:", result);
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/database";
import { errorHandler } from "./middleware/error";
import { authLimiter, generalLimiter, paymentLimiter } from "./middleware/rateLimiter";
import { logger } from "./services/loggerService";

import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import chatRoutes from "./routes/chatRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    userAgent: req.get("user-agent"),
    ip: req.ip,
  });
  next();
});

connectDB().then(() => {
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/auth", authLimiter, authRoutes);
  app.use("/events", generalLimiter, eventRoutes);
  app.use("/bookings", generalLimiter, bookingRoutes);
  app.use("/payments", paymentLimiter, paymentRoutes);
  app.use("/chat", generalLimiter, chatRoutes);
  app.use("/admin", authLimiter, adminRoutes);

  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    console.log(`🚀 Server running on port ${PORT}`);
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received: closing HTTP server");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    logger.info("SIGINT signal received: closing HTTP server");
    process.exit(0);
  });
}).catch((error) => {
  logger.error("Failed to connect to database", { error: error.message });
  process.exit(1);
});
