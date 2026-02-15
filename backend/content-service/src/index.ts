import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import eventRoutes from "./routes/eventRoute.js";
import postRoutes from "./routes/postRoute.js";
import resourceRoutes from "./routes/resourceRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/resources", resourceRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'User Service' });
});
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Content service running on port ${PORT}`);
});
