import { Request, Response } from "express";
import Verification from "../mongoose/verificationModel.js";
import { UserType } from "@prisma/client"
import { prisma } from "../prisma.js";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      uid,
      userType,
      verificationOption,
      school_id,
      teacher_id,
      organization_id,
      ...data
    } = req.body;

    if (!uid || !userType) {
      res.status(400).json({
        message: "uid and userType are required",
      });
      return;
    }

    let user: any;
    let verificationPayload: any;

    switch (userType) {
      case UserType.STUDENT:
        if (verificationOption === "DOCUMENT") {
          verificationPayload = {
            verificationMethod: "DOCUMENT_AI",
          };
        } else if (verificationOption === "TEACHER_REQUEST") {
          if (!school_id || !teacher_id) {
            res.status(400).json({
              message: "school_id and teacher_id are required",
            });
            return;
          }

          verificationPayload = {
            verificationMethod: "TEACHER_APPROVAL",
            verificationRequestedBy: teacher_id,
          };
        } else {
          res.status(400).json({
            message: "Invalid verification option",
          });
          return;
        }

        user = await prisma.student.create({
          data: {
            uid,
            ...data,
            school_id,
          },
        });

        await Verification.create({
          userId: user.uid,
          userType: "STUDENT",
          ...verificationPayload,
        });
        break;

      case UserType.TEACHER:
        if (verificationOption === "DOCUMENT") {
          verificationPayload = {
            verificationMethod: "DOCUMENT_AI",
          };
        } else if (verificationOption === "ADMIN_APPROVAL") {
          if (!school_id) {
            res.status(400).json({
              message: "school_id is required",
            });
            return;
          }

          verificationPayload = {
            verificationMethod: "ADMIN_APPROVAL",
          };
        } else {
          res.status(400).json({
            message: "Invalid verification option",
          });
          return;
        }

        user = await prisma.teacher.create({
          data: {
            uid,
            ...data,
            school_id,
          },
        });

        /*        await Verification.create({
                  userId: user.uid,
                  userType: "TEACHER",
                  ...verificationPayload,
                }); */
        break;

      case UserType.SCHOOL_ADMIN:
      case UserType.ORG_ADMIN:
      case UserType.SUPER_ADMIN:
        if (verificationOption !== "DOCUMENT") {
          res.status(400).json({
            message: "Admins must use document verification",
          });
          return;
        }

        user = await prisma.admin.create({
          data: {
            uid,
            ...data,
            adminType: userType,
            school_id: school_id ?? null,
            organization_id: organization_id ?? null,
          },
        });

        await Verification.create({
          userId: user.uid,
          userType: "ADMIN",
          verificationMethod: "DOCUMENT_AI",
        });
        break;

      default:
        res.status(400).json({
          message: "Invalid user type",
        });
        return;
    }

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// backend/user-service/src/controllers/userController.ts

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  console.log("🔥 [1] User Service Hit! Controller started.");

  try {
    const uid = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;

    console.log("🔍 [2] Headers Received:", { uid, userType });

    if (!uid || !userType) {
      console.log("❌ [3] Missing Headers. Sending 400.");
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    let user: any;

    if (userType === "STUDENT") {
      console.log("👤 [4] Fetching STUDENT...");
      user = await prisma.student.findUnique({ where: { uid } });
      console.log("✅ [5] Prisma Query Done. Result:", user ? "Found" : "Null");

      if (!user) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      // ... (your age calculation logic) ...

      res.status(200).json({
        message: "Student fetched successfully",
        userType: "STUDENT",
        user,
      });
      return;
    }

    if (userType === "TEACHER") {
      console.log("👨‍🏫 [4] Fetching TEACHER...");
      user = await prisma.teacher.findUnique({ where: { uid } });
      console.log("✅ [5] Prisma Query Done. Result:", user ? "Found" : "Null");

      if (!user) {
        res.status(404).json({ message: "Teacher not found" });
        return;
      }

      res.status(200).json({
        message: "Teacher fetched successfully",
        userType: "TEACHER",
        user,
      });
      return;
    }

    if (userType === "ADMIN") {
      console.log("🛡️ [4] Fetching ADMIN...");
      user = await prisma.admin.findUnique({ where: { uid } });

      if (!user) {
        res.status(404).json({ message: "Admin not found" });
        return;
      }

      res.status(200).json({
        message: "Admin fetched successfully",
        userType: user.adminType,
        user,
      });
      return;
    }

    console.log("⚠️ [6] User Type did not match logic:", userType);
    res.status(400).json({
      message: "Invalid user type",
    });

  } catch (error: any) {
    console.error("💥 [CRITICAL] Controller Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

/*export const getUserByFirebaseUID = async (req: Request, res: Response): Promise<void> => {
  try {
    //uid should come from frontend using firebase frontend client
    const {uid} = req.params;

    if (!uid) {
      res.status(400).json({message: "Firebase UID is required"});
      return;
    }

    let user: any;
    let userType: string;

     user = await prisma.student.findUnique({ where: { firebaseUID: uid } }); // this should be student id cus we are removing the firebase uid
    if (user) {
      userType = "STUDENT";
      const age = new Date().getFullYear() - new Date(user.date_of_birth).getFullYear();
      if (age >= 19 && !user.is_frozen) {
        await prisma.student.update({ where: { student_id: user.student_id }, data: { is_frozen: true } });
        user.is_frozen = true;
      }
      user.canInteract = user.is_active && !user.is_frozen;
      res.json({ userType, user });
      return;
    }

    user = await prisma.teacher.findUnique({where:{firebaseUID: uid}});
    if (user) {
      res.json({userType: "TEACHER", user});
      return;
    }

    user = await prisma.admin.findUnique({where: {firebaseUID: uid}});
    if (user) {
      res.json({userType: user.adminType, user});
      return;
    }

    res.status(404).json({ message: "User not found" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};*/

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;

    if (!uid || !userType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    const updateData = { ...req.body };

    // block sensitive / immutable fields
    delete updateData.uid;
    delete updateData.name;

    if (userType === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { uid },
      });

      if (!student) {
        res.status(404).json({
          message: "Student not found",
        });
        return;
      }

      const age =
        new Date().getFullYear() -
        new Date(student.date_of_birth).getFullYear();

      if (age >= 19) {
        if (!student.is_frozen) {
          await prisma.student.update({
            where: { uid },
            data: { is_frozen: true },
          });
        }

        res.status(403).json({
          message:
            "Student account is frozen. Cannot update profile after 19 years old.",
        });
        return;
      }
    }

    let updatedUser: any;

    switch (userType) {
      case "STUDENT":
        updatedUser = await prisma.student.update({
          where: { uid },
          data: updateData,
        });
        break;

      case "TEACHER":
        updatedUser = await prisma.teacher.update({
          where: { uid },
          data: updateData,
        });
        break;

      case "ADMIN":
        updatedUser = await prisma.admin.update({
          where: { uid },
          data: updateData,
        });
        break;

      default:
        res.status(400).json({
          message: "Invalid user type",
        });
        return;
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const softDeleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uid = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;

    if (!uid || !userType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    let updatedUser: any;

    switch (userType) {
      case "STUDENT":
        updatedUser = await prisma.student.update({
          where: { uid },
          data: { is_active: false },
        });
        break;

      case "TEACHER":
        updatedUser = await prisma.teacher.update({
          where: { uid },
          data: { is_active: false },
        });
        break;

      case "ADMIN":
        updatedUser = await prisma.admin.update({
          where: { uid },
          data: { is_active: false },
        });
        break;

      default:
        res.status(400).json({
          message: "Invalid user type",
        });
        return;
    }

    res.status(200).json({
      message: "User deactivated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

