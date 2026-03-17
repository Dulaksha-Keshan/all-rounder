import { Request, Response } from "express";
import { UserType } from "@prisma/client";
import mongoose from "mongoose";
import Verification from "../mongoose/verificationModel.js";
import { prisma } from "../prisma.js";

const REQUEST_USER_NAME_CACHE_TTL_MS = Number(
  process.env.REQUEST_USER_NAME_CACHE_TTL_MS || 5 * 60 * 1000
);
const REQUEST_USER_NAME_CACHE_MAX_KEYS = Number(
  process.env.REQUEST_USER_NAME_CACHE_MAX_KEYS || 5000
);

type UserNameCacheEntry = {
  name: string | null;
  expiresAt: number;
};

const userNameCache = new Map<string, UserNameCacheEntry>();

type ApproverScope = {
  type: "TEACHER" | "SCHOOL_ADMIN";
  uid: string;
  schoolId?: string;
  pendingVerificationIds: string[];
  processedVerificationIds: string[];
};

const getCachedUserName = (uid: string): string | null | undefined => {
  const entry = userNameCache.get(uid);
  if (!entry) return undefined;

  if (entry.expiresAt < Date.now()) {
    userNameCache.delete(uid);
    return undefined;
  }

  return entry.name;
};

const setCachedUserName = (uid: string, name: string | null): void => {
  if (!uid) return;

  if (userNameCache.size >= REQUEST_USER_NAME_CACHE_MAX_KEYS) {
    const firstKey = userNameCache.keys().next().value;
    if (firstKey) {
      userNameCache.delete(firstKey);
    }
  }

  userNameCache.set(uid, {
    name,
    expiresAt: Date.now() + REQUEST_USER_NAME_CACHE_TTL_MS,
  });
};

const getUserNamesBulk = async (uids: string[]): Promise<Map<string, string | null>> => {
  const userNameMap = new Map<string, string | null>();
  if (!uids.length) return userNameMap;

  const uniqueUids = Array.from(new Set(uids.filter(Boolean)));
  const uncachedUids: string[] = [];

  for (const uid of uniqueUids) {
    const cachedName = getCachedUserName(uid);
    if (cachedName !== undefined) {
      userNameMap.set(uid, cachedName);
      continue;
    }
    uncachedUids.push(uid);
  }

  if (uncachedUids.length > 0) {
    const [students, teachers, admins] = await Promise.all([
      prisma.student.findMany({
        where: { uid: { in: uncachedUids } },
        select: { uid: true, name: true },
      }),
      prisma.teacher.findMany({
        where: { uid: { in: uncachedUids } },
        select: { uid: true, name: true },
      }),
      prisma.admin.findMany({
        where: { uid: { in: uncachedUids } },
        select: { uid: true, name: true },
      }),
    ]);

    for (const user of students) {
      userNameMap.set(user.uid, user.name);
    }

    for (const user of teachers) {
      userNameMap.set(user.uid, user.name);
    }

    for (const user of admins) {
      userNameMap.set(user.uid, user.name);
    }

    for (const uid of uncachedUids) {
      if (!userNameMap.has(uid)) {
        userNameMap.set(uid, null);
      }
      setCachedUserName(uid, userNameMap.get(uid) ?? null);
    }
  }

  // Ensure all requested UIDs are present in response map.
  for (const uid of uniqueUids) {
    if (!userNameMap.has(uid)) {
      userNameMap.set(uid, null);
    }
  }

  return userNameMap;
};

const attachNamesToVerifications = async (verifications: any[]): Promise<any[]> => {
  if (!Array.isArray(verifications) || verifications.length === 0) {
    return [];
  }

  const uids = verifications.flatMap((verification) => {
    const ids: string[] = [];
    if (typeof verification?.userId === "string" && verification.userId.trim()) {
      ids.push(verification.userId);
    }
    if (
      typeof verification?.verificationRequestedBy === "string" &&
      verification.verificationRequestedBy.trim()
    ) {
      ids.push(verification.verificationRequestedBy);
    }
    return ids;
  });

  const userNameMap = await getUserNamesBulk(uids);

  return verifications.map((verification) => {
    const userName =
      typeof verification?.userId === "string"
        ? (userNameMap.get(verification.userId) ?? null)
        : null;

    const approverName =
      typeof verification?.verificationRequestedBy === "string"
        ? (userNameMap.get(verification.verificationRequestedBy) ?? null)
        : null;

    return {
      ...verification,
      userName,
      approverName,
    };
  });
};

const resolveApproverScope = async (
  req: Request,
  res: Response
): Promise<ApproverScope | null> => {
  const approverUid = req.headers["x-user-uid"] as string;
  const approverType = req.headers["x-user-type"] as string;
  const headerSchoolId = req.headers["x-school-id"] as string | undefined;
  const routeSchoolId = req.params.schoolId;

  if (!approverUid || !approverType) {
    res.status(400).json({ message: "x-user-uid and x-user-type headers are required" });
    return null;
  }

  if (approverType === UserType.TEACHER) {
    const teacher = await prisma.teacher.findUnique({ where: { uid: approverUid } });
    if (!teacher) {
      res.status(404).json({ message: "Teacher not found" });
      return null;
    }

    if (routeSchoolId && teacher.school_id !== routeSchoolId) {
      res.status(403).json({ message: "Teacher does not belong to the provided school" });
      return null;
    }

    return {
      type: "TEACHER",
      uid: approverUid,
      schoolId: teacher.school_id,
      pendingVerificationIds: teacher.pendingVerificationIds || [],
      processedVerificationIds: teacher.processedVerificationIds || [],
    };
  }

  if (approverType === UserType.SCHOOL_ADMIN) {
    if (!headerSchoolId) {
      res.status(400).json({ message: "x-school-id header is required for school admins" });
      return null;
    }

    if (routeSchoolId && routeSchoolId !== headerSchoolId) {
      res.status(403).json({ message: "Route schoolId does not match x-school-id header" });
      return null;
    }

    const admin = await prisma.admin.findUnique({ where: { uid: approverUid } });
    if (!admin || admin.adminType !== UserType.SCHOOL_ADMIN) {
      res.status(403).json({ message: "Only SCHOOL_ADMIN can process school approval requests" });
      return null;
    }

    if (!admin.school_id || admin.school_id !== headerSchoolId) {
      res.status(403).json({ message: "School admin is not authorized for this school" });
      return null;
    }

    const school = await prisma.school.findUnique({ where: { school_id: headerSchoolId } });
    if (!school) {
      res.status(404).json({ message: "School not found" });
      return null;
    }

    return {
      type: "SCHOOL_ADMIN",
      uid: approverUid,
      schoolId: headerSchoolId,
      pendingVerificationIds: school.pendingVerificationIds || [],
      processedVerificationIds: school.processedVerificationIds || [],
    };
  }

  res.status(403).json({
    message: "Only TEACHER or SCHOOL_ADMIN users can access verification requests",
  });
  return null;
};

const getExpectedMethod = (scopeType: ApproverScope["type"]): string =>
  scopeType === "TEACHER" ? "TEACHER_APPROVAL" : "ADMIN_APPROVAL";

const verificationProjection =
  "_id userId userType verificationMethod verificationStatus verificationRequestedBy attachment remarks createdAt updatedAt verifiedAt";

const fetchVerificationsByStatus = async (
  ids: string[],
  method: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  if (!ids.length) {
    return [];
  }

  return Verification.find({
    _id: { $in: ids },
    verificationMethod: method,
    verificationStatus: status,
  })
    .select(verificationProjection)
    .sort({ createdAt: -1 })
    .lean();
};

const processDecision = async (
  req: Request,
  res: Response,
  decision: "APPROVED" | "REJECTED"
): Promise<void> => {
  const scope = await resolveApproverScope(req, res);
  if (!scope) {
    return;
  }

  const { verificationId } = req.params ;
  const { remarks } = req.body as { remarks?: string };

  if (!verificationId) {
    res.status(400).json({ message: "verificationId param is required" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(verificationId as string)) {
    res.status(400).json({ message: "Invalid verificationId format" });
    return;
  }

  if (!scope.pendingVerificationIds.includes(verificationId as string)) {
    res.status(403).json({ message: "This request is not in your pending list" });
    return;
  }

  const verification = await Verification.findById(verificationId);
  if (!verification) {
    res.status(404).json({ message: "Verification request not found" });
    return;
  }

  const expectedMethod = getExpectedMethod(scope.type);
  if (verification.verificationMethod !== expectedMethod) {
    res.status(403).json({
      message: `This verifier can only process ${expectedMethod} requests`,
    });
    return;
  }

  if (verification.verificationStatus !== "PENDING") {
    res.status(400).json({ message: "Only PENDING requests can be processed" });
    return;
  }

  if (scope.type === "TEACHER" && verification.verificationRequestedBy !== scope.uid) {
    res.status(403).json({ message: "You are not authorized to process this request" });
    return;
  }

  if (scope.type === "SCHOOL_ADMIN") {
    const requestUser = await prisma.teacher.findUnique({ where: { uid: verification.userId } });
    if (!requestUser || requestUser.school_id !== scope.schoolId) {
      res.status(403).json({ message: "This request does not belong to your school" });
      return;
    }
  }

  verification.verificationStatus = decision;
  verification.verifiedAt = new Date();
  if (typeof remarks === "string") {
    verification.remarks = remarks.trim();
  }
  await verification.save();

  const updatedPendingIds = scope.pendingVerificationIds.filter((id) => id !== verificationId as string);

  if (scope.type === "TEACHER") {
    await prisma.teacher.update({
      where: { uid: scope.uid },
      data: {
        pendingVerificationIds: {
          set: updatedPendingIds,
        },
        processedVerificationIds: {
          push: verificationId,
        },
      },
    });
  } else {
    await prisma.school.update({
      where: { school_id: scope.schoolId as string },
      data: {
        pendingVerificationIds: {
          set: updatedPendingIds,
        },
        processedVerificationIds: {
          push: verificationId,
        },
      },
    });
  }

  res.status(200).json({
    message:
      decision === "APPROVED"
        ? "Verification request accepted"
        : "Verification request declined",
    verification: {
      id: verification._id.toString(),
      status: verification.verificationStatus,
      method: verification.verificationMethod,
      verifiedAt: verification.verifiedAt,
      createdAt: verification.createdAt,
      remarks: verification.remarks || null,
    },
  });
};

/**
 * Get all pending verification requests for logged-in TEACHER or SCHOOL_ADMIN
 */
export const getPendingRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const scope = await resolveApproverScope(req, res);
    if (!scope) {
      return;
    }

    const expectedMethod = getExpectedMethod(scope.type);
    const pendingVerifications = await fetchVerificationsByStatus(
      scope.pendingVerificationIds,
      expectedMethod,
      "PENDING"
    );

    const pendingVerificationsWithNames = await attachNamesToVerifications(
      pendingVerifications as any[]
    );

    res.status(200).json({
      pendingVerifications: pendingVerificationsWithNames,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all verification requests grouped by status for logged-in TEACHER or SCHOOL_ADMIN
 */
export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const scope = await resolveApproverScope(req, res);
    if (!scope) {
      return;
    }

    const expectedMethod = getExpectedMethod(scope.type);
    const [pendingVerifications, approvedVerifications, rejectedVerifications] = await Promise.all([
      fetchVerificationsByStatus(scope.pendingVerificationIds, expectedMethod, "PENDING"),
      fetchVerificationsByStatus(scope.processedVerificationIds, expectedMethod, "APPROVED"),
      fetchVerificationsByStatus(scope.processedVerificationIds, expectedMethod, "REJECTED"),
    ]);

    const [pendingWithNames, approvedWithNames, rejectedWithNames] = await Promise.all([
      attachNamesToVerifications(pendingVerifications as any[]),
      attachNamesToVerifications(approvedVerifications as any[]),
      attachNamesToVerifications(rejectedVerifications as any[]),
    ]);


    res.status(200).json({
      approverType: scope.type,
      schoolId: scope.schoolId || null,
      requests: {
        pending: pendingWithNames,
        approved: approvedWithNames,
        rejected: rejectedWithNames,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Accept a pending verification request (TEACHER or SCHOOL_ADMIN)
 */
export const acceptRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    await processDecision(req, res, "APPROVED");
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Decline a pending verification request (TEACHER or SCHOOL_ADMIN)
 */
export const declineRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    await processDecision(req, res, "REJECTED");
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};