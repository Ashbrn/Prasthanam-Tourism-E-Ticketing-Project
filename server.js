import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import tripRoutes from "./server/routes/tripRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(tripRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI in environment variables");
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
