import { Router } from "express";
import {
  listSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  getSchoolStudents,
  getSchoolTeachers,
  getSchoolStatistics,
} from "../controllers/schoolController.js";

const router = Router();

router.get("/", listSchools);
router.get("/:id", getSchoolById);
router.post("/", createSchool);
router.patch("/:id", updateSchool);
router.get("/:id/students", getSchoolStudents);
router.get("/:id/teachers", getSchoolTeachers);
router.get("/:id/statistics", getSchoolStatistics);

export default router;
