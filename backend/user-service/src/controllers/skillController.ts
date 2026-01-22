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
export const createSkill = (req: Request, res: Response): void => {};

// Add a skill to user
export const addSkillToUser = (req: Request, res: Response): void => {};

// Remove skill 
export const removeSkillFromUser = (req: Request, res: Response): void => {};

// Get user skills
export const getUserSkills = (req: Request, res: Response): void => {};
