import { Router } from "express";
import {
  createPost,
  getMyPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  deletePost,
  getFeed,
  toggleLikePost,
  addComment,
  deleteComment,
  getPostComments
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

// Get home feed posts (latest public posts)
// No headers required
router.get("/feed", getFeed);

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


// ====================
// LIKE ROUTES
// ====================

// Like or unlike a post
// Params: id (postId)
// Headers: x-user-id
router.post("/:id/like", toggleLikePost);


// ====================
// COMMENT ROUTES
// ====================

// Add a comment to a post
// Params: id (postId)
// Headers: x-user-id
// Body: { comment }
router.post("/:id/comment", addComment);

// Delete a comment from a post
// Params: postId, commentId
// Headers: x-user-id
router.delete("/:postId/comment/:commentId", deleteComment);

// Get comments of a post (paginated)
// Params: id (postId)
// Query: page, limit
router.get("/:id/comments", getPostComments);

export default router;