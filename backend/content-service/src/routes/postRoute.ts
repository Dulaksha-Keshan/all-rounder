import { Router } from "express";
import {
  createPost,
  getMyPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  deletePost,
  getFeed,
<<<<<<< HEAD
  toggleLikePost,
  addComment,
  deleteComment,
  getPostComments
=======
>>>>>>> 1bf4944 (changed postController getFeed function to get feed based on the postModel postType enum values. updated postRoute to get the updated getFeed function.)
} from "../controllers/postController.js";
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

<<<<<<< HEAD
// ====================
// POSTS CRUD ROUTES
// ====================
=======
// CRUD for posts
router.post("/", createPost);           // Create new post
router.get("/feed", getFeed);          // Get personalized feed
router.get("/", getAllPosts);          // List all posts
router.get("/:id", getPostById);       // Get single post by ID
router.put("/:id", updatePost);        // Update post by ID
router.delete("/:id", deletePost);     // Delete post by ID
>>>>>>> 1bf4944 (changed postController getFeed function to get feed based on the postModel postType enum values. updated postRoute to get the updated getFeed function.)

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