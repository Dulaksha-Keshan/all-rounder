import { Router } from "express";
import {
  acceptRequest,
  declineRequest,
  getAllRequests,
  getPendingRequests,
} from "../controllers/requestController.js";

const router = Router();

// pending
router.get("/pending", getPendingRequests);
router.get("/pending/:schoolId", getPendingRequests);

// all requests
router.get("/all-requests", getAllRequests);
router.get("/all-requests/:schoolId", getAllRequests);

// accept
router.patch("/:verificationId/accept", acceptRequest);
router.patch("/:verificationId/accept/:schoolId", acceptRequest);

// decline
router.patch("/:verificationId/decline", declineRequest);
router.patch("/:verificationId/decline/:schoolId", declineRequest);

export default router;
