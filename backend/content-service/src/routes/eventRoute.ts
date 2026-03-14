import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array('attachments', 10), createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", upload.array('attachments', 10), updateEvent);
router.delete("/:id", deleteEvent);

export default router;
