import { Router } from "express";
import {
  listOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
} from "../controllers/organizationController.js";

const router = Router();

router.get("/", listOrganizations);
router.get("/:id", getOrganizationById);
router.post("/", createOrganization);
router.patch("/:id", updateOrganization);

export default router;
