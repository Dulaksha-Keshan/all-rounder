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
            school: {
              connect: { school_id: school_id }
            }
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
            school: {
              connect: { school_id: school_id }
            }
          },
        });

        await Verification.create({
          userId: user.uid,
          userType: "TEACHER",
          ...verificationPayload,
        });
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


        if (userType === UserType.SCHOOL_ADMIN && !school_id) {
          res.status(400).json({ message: "School Admin must have a school_id" });
          return;
        }
        if (userType === UserType.ORG_ADMIN && !organization_id) {
          res.status(400).json({ message: "Org Admin must have an organization_id" });
          return;
        }


        user = await prisma.admin.create({
          data: {
            uid,
            ...data,
            adminType: userType,
            ...(school_id && {
              school: {
                connect: { school_id: school_id }
              }
            }),
            ...(organization_id && {
              organization: {
                connect: { organization_id: organization_id }
              }
            })
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
//uses the token to retrive the logged user 
export const getUserById = async (req: Request, res: Response): Promise<void> => {

  try {
    const uid = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;


    if (!uid || !userType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    let user: any;

    if (userType === UserType.STUDENT) {
      user = await prisma.student.findUnique({ where: { uid } });

      if (!user) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      // ... (your age calculation logic) ...

      res.status(200).json({
        message: "Student fetched successfully",
        userType: UserType.STUDENT,
        user,
      });
      return;
    }

    if (userType === UserType.TEACHER) {
      user = await prisma.teacher.findUnique({ where: { uid } });

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

    if (userType === UserType.ORG_ADMIN || UserType.SUPER_ADMIN || UserType.SCHOOL_ADMIN) {
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

    res.status(400).json({
      message: "Invalid user type",
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};


//fetches the user by uid for viewing 
export const getUserByFirebaseUID = async (req: Request, res: Response): Promise<void> => {
  try {
    //uid should come from frontend using firebase frontend client
    const { uid } = req.params;

    if (!uid) {
      res.status(400).json({ message: "Firebase UID is required" });
      return;
    }

    let user: any;
    let userType: string;

    user = await prisma.student.findUnique({ where: { uid: uid as string } });
    if (user) {
      userType = UserType.STUDENT;
      const age = new Date().getFullYear() - new Date(user.date_of_birth).getFullYear();
      if (age >= 19 && !user.is_frozen) {
        await prisma.student.update({ where: { uid: user.uid }, data: { is_frozen: true } });
        user.is_frozen = true;
      }
      user.canInteract = user.is_active && !user.is_frozen;
      res.json({ userType, user });
      return;
    }

    user = await prisma.teacher.findUnique({ where: { uid: uid as string } });
    if (user) {
      res.json({ userType: UserType.TEACHER, user });
      return;
    }

    user = await prisma.admin.findUnique({ where: { uid: uid as string } });
    if (user) {
      res.json({ userType: user.adminType, user });
      return
    }
    res.status(404).json({ message: "User not found" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


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

    if (userType === UserType.STUDENT) {
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
      case UserType.STUDENT:
        updatedUser = await prisma.student.update({
          where: { uid },
          data: updateData,
        });
        break;

      case UserType.TEACHER:
        updatedUser = await prisma.teacher.update({
          where: { uid },
          data: updateData,
        });

        break;

      case UserType.SCHOOL_ADMIN:
      case UserType.ORG_ADMIN:
      case UserType.SUPER_ADMIN:
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
      case UserType.STUDENT:
        updatedUser = await prisma.student.update({
          where: { uid },
          data: { is_active: false },
        });
        break;

      case UserType.TEACHER:
        updatedUser = await prisma.teacher.update({
          where: { uid },
          data: { is_active: false },
        });
        break;

      case UserType.SCHOOL_ADMIN:
      case UserType.ORG_ADMIN:
      case UserType.SUPER_ADMIN:
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

//TODO: Social actions 

export const followUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const followerId = req.headers["x-user-uid"] as string;
    const followingId = req.params.uid as string;

    if (!followerId) {
      res.status(400).json({
        message: "x-user-uid header is required",
      });
      return;
    }

    if (!followingId) {
      res.status(400).json({
        message: "Target user uid is required",
      });
      return;
    }

    // Prevent self follow
    if (followerId === followingId) {
      res.status(400).json({
        message: "You cannot follow yourself",
      });
      return;
    }

    // Create follow (unique constraint will prevent duplicates)
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.status(201).json({
      message: "User followed successfully",
      follow,
    });

  } catch (error: any) {

    // Prisma duplicate follow protection
    if (error.code === "P2002") {
      res.status(400).json({
        message: "You are already following this user",
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};