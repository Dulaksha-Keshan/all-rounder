import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/extension";
const prisma = new PrismaClient();

// List all skills
export const listSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      message: "Skills fetched successfully",
      count: skills.length,
      skills,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create skill (ADMIN only)
export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const userType = req.headers["x-User-type"] as string;
    const { name, description } = req.body;

    if (!userType) {
      res.status(400).json({
        message: "x-user-type header is required",
      });
      return;
    }

    if (userType !== "SUPER_ADMIN") {
      res.status(403).json({
        message: "Only super admin can create skills",
      });
      return;
    }

    if (!name) {
      res.status(400).json({
        message: "Skill name is required",
      });
      return;
    }

    const existingSkill = await prisma.skill.findUnique({
      where: { name },
    });

    if (existingSkill) {
      res.status(400).json({
        message: "Skill with this name already exists",
      });
      return;
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        description: description ?? null,
      },
    });

    res.status(201).json({
      message: "Skill created successfully",
      skill,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add a skill to user
export const addSkillToUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.headers["x-User-id"]);
    const userType = req.headers["x-User-type"] as string;
    const { skillId } = req.body;

    if (!userId || !userType) {
      res.status(400).json({
        message: "x-user-id and x-user-type headers are required",
      });
      return;
    }

    if (!skillId) {
      res.status(400).json({
        message: "skillId is required in body",
      });
      return;
    }

    const skill = await prisma.skill.findUnique({ where: { skill_id: skillId } });
    if (!skill) {
      res.status(404).json({
        message: "Skill not found",
      });
      return;
    }

    let userSkill: any;

    switch (userType) {
      case "STUDENT":
        userSkill = await prisma.userSkills.create({
          data: {
            student_id: userId,
            skill_id: skillId,
          },
        });
        break;

      case "TEACHER":
        userSkill = await prisma.userSkills.create({
          data: {
            teacher_id: userId,
            skill_id: skillId,
          },
        });
        break;

      case "ADMIN":
        userSkill = await prisma.userSkills.create({
          data: {
            admin_id: userId,
            skill_id: skillId,
          },
        });
        break;

      default:
        res.status(400).json({
          message: "Invalid user type",
        });
        return;
    }

    res.status(201).json({
      message: "Skill added to user successfully",
      userSkill,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove skill 
export const removeSkillFromUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.headers["x-User-id"]);
    const userType = req.headers["x-User-type"] as string;
    const { skillId } = req.body;

    if (!userId || !userType) {
      res.status(400).json({
        message: "x-user-id and x-user-type headers are required",
      });
      return;
    }

    if (!skillId) {
      res.status(400).json({
        message: "skillId is required in the request body",
      });
      return;
    }

    let userExists = false;
    switch (userType) {
      case "STUDENT":
        userExists = !!(await prisma.student.findUnique({ where: { uid: userId } }));
        break;
      case "TEACHER":
        userExists = !!(await prisma.teacher.findUnique({ where: { uid: userId } }));
        break;
      case "ADMIN":
        userExists = !!(await prisma.admin.findUnique({ where: { uid: userId } }));
        break;
      default:
        res.status(400).json({ message: "Invalid user type" });
        return;
    }

    if (!userExists) {
      res.status(404).json({ message: `${userType} not found` });
      return;
    }

    const updatedUser = await prisma.userSkill.deleteMany({
      where: {
        userId,
        skillId,
      },
    });

    res.status(200).json({
      message: "Skill removed from user successfully",
      removedCount: updatedUser.count,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user skills
export const getUserSkills = (req: Request, res: Response): void => {};
