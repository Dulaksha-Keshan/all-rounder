import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = Router();

// CRUD for posts
router.post("/", createPost);           // Create new post
router.get("/", getAllPosts);          // List all posts
router.get("/:id", getPostById);       // Get single post by ID
router.put("/:id", updatePost);        // Update post by ID
router.delete("/:id", deletePost);     // Delete post by ID

export default router;
