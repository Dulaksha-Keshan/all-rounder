import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { uploadMiddleware, uploadResource, searchResources, downloadResource } from "./controllers/resourceController.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Routes
const router = express.Router();

router.post("/upload", uploadMiddleware, uploadResource);
router.get("/search", searchResources);
router.get("/download/:id", downloadResource);

app.use("/api/content/resources", router);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Content Service running on port ${PORT}`);
});