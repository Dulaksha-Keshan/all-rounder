import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/extension";
import {createUser} from "./userController.js";

export const listSchools = (req: Request, res: Response): void => {};

export const getSchoolById = (req: Request, res: Response): void => {};

//in the resgistration form coming from frontend will contain school registration info and admin registration info (id of school will come to admin)
//create the school profile first
const prisma = new PrismaClient();

export const createSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { school, admin } = req.body;

    if (!school || !admin) {
      res.status(400).json({ message: "School and admin data are required" });
      return;
    }

    const createdSchool = await prisma.school.create({
      data: {
        name: school.name,
        address: school.address,
        district: school.district,
        email: school.email,
        contact_number: school.contact_number,
        principal_name: school.principal_name ?? null,
        web_link: school.web_link ?? null,
      },
    });

    const adminReq = {
      body: {
        ...admin,
        userType: prisma.UserType.SCHOOL_ADMIN,
        school_id: createdSchool.school_id,
      },
    } as Request;

    await createUser(
      adminReq,
      {
        status: () => ({
          json: () => {},
        }),
      } as unknown as Response
    );

    res.status(201).json({
      message: "School and admin created successfully",
      school: createdSchool,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateSchool = (req: Request, res: Response): void => {};

export const getSchoolStudents = (req: Request, res: Response): void => {};

export const getSchoolTeachers = (req: Request, res: Response): void => {};

export const getSchoolStatistics = (req: Request, res: Response): void => {};
