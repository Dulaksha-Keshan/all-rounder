import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  softDeleteUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", softDeleteUser);

export default router;
