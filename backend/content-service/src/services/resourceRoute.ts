import { Router } from "express";
import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  searchResources,
} from "../controllers/resourceController.js";

const router = Router();

router.post("/", createResource);                 // Post a new resource request
router.post("/schools/:schoolId", createResource); // School-scoped create route for gateway validation
router.get("/", getAllResources);                // List all resource requests
router.get("/search", searchResources);          // Search resource requests
router.get("/:id", getResourceById);             // Get resource request by ID
router.put("/:id", updateResource);              // Update resource request
router.delete("/:id", deleteResource);           // Delete resource request


export default router;
