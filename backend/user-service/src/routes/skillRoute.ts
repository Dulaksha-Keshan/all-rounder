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

router.post("/users/:id/skills", addSkillToUser);

router.delete("/users/:id/skills/:skillId", removeSkillFromUser);

router.get("/users/:id/skills", getUserSkills);

export default router;
