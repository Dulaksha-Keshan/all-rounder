import { Request, Response } from "express";
import Verification from "../mongoose/verificationModel.js";
import { prisma } from "../prisma.js";

/**
 * Get all pending verification requests for the logged-in teacher
 */
export const getPendingRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const teacherUid = req.headers["x-user-uid"] as string;

    if (!teacherUid) {
      res.status(400).json({ message: "x-user-uid header is required" });
      return;
    }

    const teacher = await prisma.teacher.findUnique({
      where: { uid: teacherUid },
    });

    if (!teacher) {
      res.status(404).json({ message: "Teacher not found" });
      return;
    }

    // Fetch pending verifications from MongoDB, only needed fields
    const pendingVerifications = await Verification.find({
      _id: { $in: teacher.pendingVerificationIds || [] }, // pending array in Prisma Teacher model
      verificationMethod: "TEACHER_APPROVAL",     // only teacher-approval requests
      verificationStatus: "PENDING",
    })
      .select("_id verificationMethod verificationStatus remarks createdAt") // hide sensitive student info
      .lean();

    res.status(200).json({ pendingVerifications });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
/**
 * Teacher accepts a student verification request
 */
export const acceptRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const teacherUid = req.headers["x-user-uid"] as string;
    const { verificationId } = req.params;

    if (!teacherUid || !verificationId) {
      res.status(400).json({ message: "Teacher UID and verification ID are required" });
      return;
    }

    const teacher = await prisma.teacher.findUnique({ where: { uid: teacherUid } });
    if (!teacher) {
      res.status(404).json({ message: "Teacher not found" });
      return;
    }

    const verification = await Verification.findById(verificationId);
    if (!verification) {
      res.status(404).json({ message: "Verification request not found" });
      return;
    }

    if (verification.verificationRequestedBy !== teacherUid) {
      res.status(403).json({ message: "You are not authorized to approve this request" });
      return;
    }

    // Update MongoDB verification status
    verification.verificationStatus = "APPROVED";
    verification.verifiedAt = new Date();
    await verification.save();

    // Convert ObjectId to string for Prisma
    const verificationIdStr = verification._id.toString();

    // Move from pending → approved in Teacher model
    await prisma.teacher.update({
      where: { uid: teacherUid },
      data: {
        pendingVerificationIds: {
          set: (teacher.pendingVerificationIds || []).filter((id: string) => id !== verificationIdStr),
        },
        processedVerificationIds: {
          push: verificationIdStr,
        },
      },
    });

    res.status(200).json({ message: "Verification request accepted" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Teacher declines a student verification request
 */
export const declineRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const teacherUid = req.headers["x-user-uid"] as string;
    const { verificationId } = req.params;

    if (!teacherUid || !verificationId) {
      res.status(400).json({ message: "Teacher UID and verification ID are required" });
      return;
    }

    const teacher = await prisma.teacher.findUnique({ where: { uid: teacherUid } });
    if (!teacher) {
      res.status(404).json({ message: "Teacher not found" });
      return;
    }

    const verification = await Verification.findById(verificationId);
    if (!verification) {
      res.status(404).json({ message: "Verification request not found" });
      return;
    }

    if (verification.verificationRequestedBy !== teacherUid) {
      res.status(403).json({ message: "You are not authorized to decline this request" });
      return;
    }

    // Update MongoDB verification status
    verification.verificationStatus = "REJECTED";
    verification.verifiedAt = new Date();
    await verification.save();

    const verificationIdStr = verification._id.toString();

    // Remove from pending array
    await prisma.teacher.update({
      where: { uid: teacherUid },
      data: {
        pendingVerificationIds: {
          set: (teacher.pendingVerificationIds || []).filter((id: string) => id !== verificationIdStr),
        },
      },
    });

    res.status(200).json({ message: "Verification request declined" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};