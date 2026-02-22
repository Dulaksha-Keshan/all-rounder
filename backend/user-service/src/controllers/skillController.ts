import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { UserType } from "@prisma/client";

// List all skills
export const listSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await prisma.skill.findMany({
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
    const userType = req.headers["x-user-type"] as string;
    const { name, category } = req.body;

    if (!userType) {
      res.status(400).json({
        message: "x-user-type header is required",
      });
      return;
    }

    if (userType !== UserType.SUPER_ADMIN) {
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
      where: { skill_name: name as string },
    });

    if (existingSkill) {
      res.status(400).json({
        message: "Skill with this name already exists",
      });
      return;
    }

    const skill = await prisma.skill.create({
      data: {
        skill_name: name,
        category
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
    const userId = req.headers["x-user-uid"];
    const userType = req.headers["x-user-type"] as string;
    const { skillId } = req.body;

    if (!userId || !userType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
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

    if (userType != UserType.STUDENT) {
      res.status(404).json({
        message: "Invalid User type to have a skill Only students allowed",
      });
      return;

    }

    const userWithSkill = await prisma.student.findUnique({
      where: {
        uid: userId as string,

        skills: {
          some: {
            skill_id: skillId
          }
        }
      }
    });


    if (userWithSkill) {
      res.status(404).json({
        message: "User already have this skill",
      });
      return;

    }



    userSkill = await prisma.student.update({
      where: { uid: userId as string },
      data: {
        skills: {
          connect: [
            { skill_id: skillId }
          ]
        }
      }
    })



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
    const userId = req.headers["x-user-uid"];
    const userType = req.headers["x-user-type"] as string;
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
    const userWithSkill = await prisma.student.findUnique({
      where: {
        uid: userId as string,

        skills: {
          some: {
            skill_id: skillId
          }
        }
      }
    });


    if (!userWithSkill) {
      res.status(404).json({
        message: "User doesn't have this skill",
      });
      return;

    }



    const updatedUser = await prisma.student.update({
      where: {
        uid: userId as string
      },
      data: {
        skills: {
          disconnect: [{
            skill_id: skillId
          }]
        }
      }
    })


    res.status(200).json({
      message: "Skill removed from user successfully",
      updatedUser
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user skills
export const getUserSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const userUid = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;

    if (!userUid || !userType) {
      res.status(400).json({ message: "x-user-uid and x-user-type headers are required" });
      return;
    }

    if (userType !== UserType.STUDENT) {
      res.status(400).json({ message: "Only students have skills" });
      return;
    }

    const student = await prisma.student.findUnique({
      where: { uid: userUid },
      include: { skills: true },
    });

    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({
      message: "User skills fetched successfully",
      skills: student.skills,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
