import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/extension";
import Verification from "../mongoose/verificationModel.js";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firebaseUID,
      userType,
      verificationOption,
      school_id,
      teacher_id,
      organization_id,
      ...data
    } = req.body;

    if (!firebaseUID || !userType) {
      res.status(400).json({ message: "firebaseUID and userType are required" });
      return;
    }

    let user: any;
    let verificationPayload: any;

    switch (userType) {
      case prisma.UserType.STUDENT:
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
          res.status(400).json({ message: "Invalid verification option" });
          return;
        }

        user = await prisma.student.create({
          data: {
            firebaseUID,
            ...data,
            school_id,
          },
        });

        await Verification.create({
          userId: user.student_id,
          userType: "STUDENT",
          ...verificationPayload,
        });
        break;

      case prisma.UserType.TEACHER:
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
          res.status(400).json({ message: "Invalid verification option" });
          return;
        }

        user = await prisma.teacher.create({
          data: {
            firebaseUID,
            ...data,
            school_id,
          },
        });

        await Verification.create({
          userId: user.teacher_id,
          userType: "TEACHER",
          ...verificationPayload,
        });
        break;

      case prisma.UserType.SCHOOL_ADMIN:
      case prisma.UserType.ORG_ADMIN:
      case prisma.UserType.SUPER_ADMIN:
        if (verificationOption !== "DOCUMENT") {
          res.status(400).json({
            message: "Admins must use document verification",
          });
          return;
        }

        user = await prisma.admin.create({
          data: {
            firebaseUID,
            ...data,
            adminType: userType,
            school_id: school_id ?? null,
            organization_id: organization_id ?? null,
          },
        });

        await Verification.create({
          userId: user.admin_id,
          userType: "ADMIN",
          verificationMethod: "DOCUMENT_AI",
        });
        break;

      default:
        res.status(400).json({ message: "Invalid user type" });
        return;
    }

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.headers["x-User-id"]);
    const userType = req.headers["x-User-type"] as string;

    if (!userId || !userType) {
      res.status(400).json({
        message: "x-user-id and x-user-type headers are required",
      });
      return;
    }

    let user: any;

    if (userType === "STUDENT") {
      user = await prisma.student.findUnique({
        where: { student_id: userId },
      });

      if (!user) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      const age =
        new Date().getFullYear() -
        new Date(user.date_of_birth).getFullYear();

      // Auto-freeze if 19+
      if (age >= 19 && !user.is_frozen) {
        await prisma.student.update({
          where: { student_id: userId },
          data: { is_frozen: true },
        });
        user.is_frozen = true;
      }

      user.canInteract = user.is_active && !user.is_frozen;

      res.status(200).json({
        message: "Student fetched successfully",
        userType: "STUDENT",
        user,
      });
      return;
    }

    if (userType === "TEACHER") {
      user = await prisma.teacher.findUnique({
        where: { teacher_id: userId },
      });

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
      user = await prisma.admin.findUnique({
        where: { admin_id: userId },
      });

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

    res.status(400).json({ message: "Invalid user type" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
    const { id } = req.params; //get from req.headers and find what u need like user id
    const { userType, ...updateData } = req.body;

    if (!userType) {
      res.status(400).json({ message: "userType is required to update a user" });
      return;
    }

    if (!id) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    delete updateData.firebaseUID;
    delete updateData.student_id;
    delete updateData.teacher_id;
    delete updateData.admin_id;
    delete updateData.name; 


    if (userType === "STUDENT") {
      const student = await prisma.student.findUnique({ where: { student_id: Number(id) } });
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }  

      const age = new Date().getFullYear() - new Date(student.date_of_birth).getFullYear();
      if (age >= 19) {
        //freeze student account if not already
        if (!student.is_frozen) {
          await prisma.student.update({ where: { student_id: student.student_id }, data: { is_frozen: true } });
        }
        res.status(403).json({ message: "Student account is frozen. Cannot update profile after 19 years old." });
        return;
      }
    }
    
    let updatedUser: any;

    switch (userType) {
      case "STUDENT":
        updatedUser = await prisma.student.update({
          where: { student_id: Number(id) },
          data: updateData,
        });
        break;

      case "TEACHER":
        updatedUser = await prisma.teacher.update({
          where: { teacher_id: Number(id) },
          data: updateData,
        });
        break;

      case "ADMIN":
        updatedUser = await prisma.admin.update({
          where: { admin_id: Number(id) },
          data: updateData,
        });
        break;

      default:
        res.status(400).json({ message: "Invalid userType provided" });
        return;
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const softDeleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userType } = req.body;// do not use body. everything will be in headers.

    if (!userType) {
      res.status(400).json({ message: "userType is required to delete a user" });
      return;
    }

    if (!id) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    let updatedUser: any;
    const userId = Number(id);

    switch (userType) {
      case "STUDENT":
        updatedUser = await prisma.student.update({
          where: { student_id: userId },
          data: { is_active: false }, //have to add is active field in db
        });
        break;

      case "TEACHER":
        updatedUser = await prisma.teacher.update({
          where: { teacher_id: userId },
          data: { is_active: false },
        });
        break;

      case "ADMIN":
        updatedUser = await prisma.admin.update({
          where: { admin_id: userId },
          data: { is_active: false },
        });
        break;

      default:
        res.status(400).json({ message: "Invalid userType provided" });
        return;
    }

    res.status(200).json({
      message: "User deactivated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
