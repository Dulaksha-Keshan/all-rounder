import { Router } from "express";
import {
  createUser,
  getUserById,
  getUserByFirebaseUID,
  updateUser,
  softDeleteUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/:id", getUserById);
router.get("/firebase/:uid", getUserByFirebaseUID);
router.patch("/:id", updateUser);
router.delete("/:id", softDeleteUser);

export default router;
