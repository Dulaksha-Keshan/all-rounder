import { Router } from "express";
import {
  createEventHost,
  getEventHosts,
  getSchoolEventIds,
  getOrganizationEventIds,
  deleteEventHosts,
} from "../controllers/eventHostController.js";

const router = Router();

// Called by Content Service when event is created
router.post("/", createEventHost);

router.get("/school/:schoolId", getSchoolEventIds);

router.get("/organization/:orgId", getOrganizationEventIds);

// Called by Content Service to get host details
router.get("/:eventId", getEventHosts);

router.delete("/:eventId", deleteEventHosts);

export default router;

