import { Router } from "express";
import {
  createPost,
  getMyPosts,
  getPostsByUser,
  getPostsBySchoolId,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost,
  getFeed,
  toggleLikePost,
  addComment,
  deleteComment,
  getPostComments
} from "../controllers/postController.js";
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ====================
// POSTS CRUD ROUTES
// ====================

// List all posts
router.get("/", getAllPosts);

// Create a new post
// Headers: x-user-uid, x-user-type
router.post("/", upload.array('attachments', 10), createPost);

// Get posts of logged-in user (my profile)
// Headers: x-user-uid, x-user-type
// Optional query: category, visibility
router.get("/me", getMyPosts);

// Get posts of another user
// Params: userId
// Query: userType, category
router.get("/user/:userId", getPostsByUser);

// Get public posts by school id
// Params: schoolId
// Optional query: category
router.get("/school/:schoolId", getPostsBySchoolId);

// Get home feed posts (latest public posts)
// No headers required
router.get("/feed", getFeed);

// Get a single post by ID
// Params: id
// Optional header: x-user-uid (for private post access)
router.get("/:id", getPostById);

// Update a post by ID
// Params: id
// Headers: x-user-uid, x-user-type
router.put("/:id", upload.array('attachments', 10), updatePost);

// Delete (soft delete) a post by ID
// Params: id
// Headers: x-user-uid, x-user-type
router.delete("/:id", deletePost);


// ====================
// LIKE ROUTES
// ====================

// Like or unlike a post
// Params: id (postId)
// Headers: x-user-uid
router.post("/:id/like", toggleLikePost);


// ====================
// COMMENT ROUTES
// ====================

// Add a comment to a post
// Params: id (postId)
// Headers: x-user-uid
// Body: { comment }
router.post("/:id/comment", addComment);

// Delete a comment from a post
// Params: postId, commentId
// Headers: x-user-uid
router.delete("/:postId/comment/:commentId", deleteComment);

// Get comments of a post (paginated)
// Params: id (postId)
// Query: page, limit
router.get("/:id/comments", getPostComments);

export default router;