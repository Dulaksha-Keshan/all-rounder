import { NextFunction, Request, Response, Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  softDeleteUser,
  getUserByFirebaseUID,
  getUsersBasicByUids,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from "../controllers/userController.js";
import multer from "multer";

const router = Router();

const verificationUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error("Invalid file type. Allowed types: PDF, JPEG, PNG, WEBP"));
      return;
    }

    cb(null, true);
  },
});

const uploadVerificationAttachment = (req: Request, res: Response, next: NextFunction) => {
  verificationUpload.single("verificationAttachment")(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        message: "File too large. Maximum allowed size is 5MB",
      });
      return;
    }

    const errorMessage = error instanceof Error ? error.message : "File upload failed";
    res.status(400).json({ message: errorMessage });
  });
};

router.post("/", uploadVerificationAttachment, createUser);

//internal use only - get basic info of multiple users by their UIDs
router.post("/bulk-basic", getUsersBasicByUids);
router.get("/", getUserById);
router.get("/firebase/:uid", getUserByFirebaseUID)
router.patch("/", updateUser);
router.delete("/", softDeleteUser);
// Follow a user
router.post("/:uid/follow", followUser);

// Unfollow a user
router.delete("/:uid/unfollow", unfollowUser);

// Get followers of a user
router.get("/:uid/followers", getFollowers);

// Get users someone is following
router.get("/:uid/following", getFollowing);
export default router;
