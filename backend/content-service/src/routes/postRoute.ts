import { Router } from "express";
import {
  createPost,
  getMyPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = Router();

// ====================
// POSTS CRUD ROUTES
// ====================

// Create a new post
// Headers: x-user-id, x-user-type
router.post("/", createPost);

// Get posts of logged-in user (my profile)
// Headers: x-user-id, x-user-type
// Optional query: category, visibility
router.get("/me", getMyPosts);

// Get posts of another user
// Params: userId
// Query: userType, category
router.get("/user/:userId", getPostsByUser);

// Get a single post by ID
// Params: id
// Optional header: x-user-id (for private post access)
router.get("/:id", getPostById);

// Update a post by ID
// Params: id
// Headers: x-user-id, x-user-type
router.put("/:id", updatePost);

// Delete (soft delete) a post by ID
// Params: id
// Headers: x-user-id, x-user-type
router.delete("/:id", deletePost);

export default router;