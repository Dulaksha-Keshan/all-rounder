import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  softDeleteUser,
  getUserByFirebaseUID
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/", getUserById);
router.get("/firebase/:uid", getUserByFirebaseUID)
router.patch("/", updateUser);
router.delete("/", softDeleteUser);

export default router;
