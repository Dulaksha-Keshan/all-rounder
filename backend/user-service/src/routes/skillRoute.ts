// routes/skillRoutes.ts
import { Router } from "express";
import {
  listSkills,
  createSkill,
  addSkillToUser,
  removeSkillFromUser,
  getUserSkills,
} from "../controllers/skillController.js";

const router = Router();

router.get("/", listSkills);

router.post("/", createSkill);

router.post("/users", addSkillToUser);

router.delete("/users", removeSkillFromUser);

router.get("/users", getUserSkills);

export default router;
