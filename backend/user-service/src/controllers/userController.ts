// controllers/userController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { role, firebase_uid, email, name, ...otherData } = req.body;

  if (!role || !firebase_uid || !email) {
    res.status(400).json({ error: "Missing required fields: role, firebase_uid, email" });
    return;
  }

  try {
    let newUser;

    switch (role) {
      case "STUDENT":
        newUser = await prisma.student.create({
          data: {
            name, email, firebase_uid,
            date_of_birth: new Date(otherData.date_of_birth),
            grade: otherData.grade,
            about: otherData.about,
            school: { connect: { school_id: Number(otherData.school_id) } }
          }
        });
        break;

      case "TEACHER":
        newUser = await prisma.teacher.create({
          data: {
            name, email, firebase_uid,
            date_of_birth: new Date(otherData.date_of_birth),
            subject: otherData.subject,
            designation: otherData.designation,
            staff_id: otherData.staff_id,
            school: { connect: { school_id: Number(otherData.school_id) } }
          }
        });
        break;

      case "ADMIN":
        newUser = await prisma.admin.create({
          data: {
            name, email, firebase_uid,
            date_of_birth: new Date(otherData.date_of_birth),
            staff_id: otherData.staff_id,
            school: { connect: { school_id: Number(otherData.school_id) } }
          }
        });
        break;

      default:
        res.status(400).json({ error: "Invalid role provided." });
        return;
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { role } = req.query; // Role is required to know which table to query

  if (!role) {
    res.status(400).json({ error: "Role is required as a query param" });
    return;
  }

  try {
    let user;
    const userId = Number(id);

    if (role === "STUDENT") {
      user = await prisma.student.findUnique({ where: { student_id: userId } });
    } else if (role === "TEACHER") {
      user = await prisma.teacher.findUnique({ where: { teacher_id: userId } });
    } else if (role === "ADMIN") {
      user = await prisma.admin.findUnique({ where: { admin_id: userId } });
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

export const getUserByFirebaseUID = async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params; // Assuming route is like /users/firebase/:uid

  try {
    // Since we might not know the role yet, we check all tables
    let user: any = await prisma.student.findUnique({ where: { firebase_uid: uid } });
    let role = "STUDENT";

    if (!user) {
      user = await prisma.teacher.findUnique({ where: { firebase_uid: uid } });
      role = "TEACHER";
    }

    if (!user) {
      user = await prisma.admin.findUnique({ where: { firebase_uid: uid } });
      role = "ADMIN";
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Return user data along with their detected role
    res.json({ ...user, role });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { role, ...updateData } = req.body;

  if (!role) {
    res.status(400).json({ error: "Role is required to update user" });
    return;
  }

  try {
    // Protect immutable fields
    delete updateData.firebase_uid;
    delete updateData.student_id;
    delete updateData.teacher_id;
    delete updateData.admin_id;

    let updatedUser;
    const userId = Number(id);

    if (role === "STUDENT") {
      updatedUser = await prisma.student.update({
        where: { student_id: userId },
        data: updateData,
      });
    } else if (role === "TEACHER") {
      updatedUser = await prisma.teacher.update({
        where: { teacher_id: userId },
        data: updateData,
      });
    } else if (role === "ADMIN") {
      updatedUser = await prisma.admin.update({
        where: { admin_id: userId },
        data: updateData,
      });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const softDeleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { role } = req.body; // Or req.query

  if (!role) {
    res.status(400).json({ error: "Role is required to delete user" });
    return;
  }

  try {
    const userId = Number(id);

    // Assuming you added 'is_active' or similar to your schema as discussed
    // If you haven't added it yet, this will error. 
    // Alternatively, you can use prisma.delete() for hard delete.
    const data = { is_active: false };

    if (role === "STUDENT") {
      await prisma.student.update({ where: { student_id: userId }, data });
    } else if (role === "TEACHER") {
      await prisma.teacher.update({ where: { teacher_id: userId }, data });
    } else if (role === "ADMIN") {
      await prisma.admin.update({ where: { admin_id: userId }, data });
    }

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
