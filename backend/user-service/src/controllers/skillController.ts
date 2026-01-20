import { Request, Response } from "express";

// List all skills
export const listSkills = (req: Request, res: Response): void => {};

// Create skill (ADMIN only)
export const createSkill = (req: Request, res: Response): void => {};

// Add a skill to user
export const addSkillToUser = (req: Request, res: Response): void => {};

// Remove skill 
export const removeSkillFromUser = (req: Request, res: Response): void => {};

// Get user skills
export const getUserSkills = (req: Request, res: Response): void => {};
