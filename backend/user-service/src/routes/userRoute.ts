import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  softDeleteUser,
  getUserByFirebaseUID,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/", getUserById);
router.get("/firebase/:uid", getUserByFirebaseUID)
router.patch("/", updateUser);
router.delete("/", softDeleteUser);
// Follow a user
router.post("/:uid/follow", followUser);

// Unfollow a user
router.delete("/:uid/unfollow", unfollowUser);

// Get followers of a user
router.get("/:uid/followers", getFollowers);

// Get users someone is following
router.get("/:uid/following", getFollowing);
export default router;
