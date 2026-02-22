import { Router } from "express";
import {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
  getMembers,
  getUserClubs,
} from "../controllers/clubController.js";

const router = Router();

// GET /api/clubs - list all clubs
router.get("/", getAllClubs);

router.get("/myClubs", getUserClubs)
// GET /api/clubs/:id - get club by id
router.get("/:id", getClubById);


router.get("/members/:id", getMembers);



// POST /api/clubs - create new club
router.post("/", createClub);

// PUT /api/clubs/:id - update club
router.patch("/:id", updateClub);

router.patch("/join/:id", joinClub);


router.patch("/leave/:id", leaveClub);

// DELETE /api/clubs/:id - delete club
router.delete("/:id", deleteClub);

export default router;
