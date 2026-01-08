import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/extension";
import {createUser} from "./userController.js";

export const listSchools = (req: Request, res: Response): void => {};

export const getSchoolById = (req: Request, res: Response): void => {};

//in the resgistration form coming from frontend will contain school registration info and admin registration info (id of school will come to admin)
//create the school profile first
const prisma = new PrismaClient();

export const createSchool = async (req: Request, res: Response): Promise<void> => {
  
};

export const updateSchool = (req: Request, res: Response): void => {};

export const getSchoolStudents = (req: Request, res: Response): void => {};

export const getSchoolTeachers = (req: Request, res: Response): void => {};

export const getSchoolStatistics = (req: Request, res: Response): void => {};
