import { Router } from "express";
import {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
} from "../controllers/clubController.js";

const router = Router();

// GET /api/clubs - list all clubs
router.get("/", getAllClubs);

// GET /api/clubs/:id - get club by id
router.get("/:id", getClubById);

// POST /api/clubs - create new club
router.post("/", createClub);

// PUT /api/clubs/:id - update club
router.put("/:id", updateClub);

// DELETE /api/clubs/:id - delete club
router.delete("/:id", deleteClub);

export default router;
