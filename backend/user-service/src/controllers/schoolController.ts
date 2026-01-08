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

export const updateSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, address, district, email, contact_number, principal_name, web_link } = req.body;

    if (!id) {
      res.status(400).json({ message: "School ID is required" });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (district) updateData.district = district;
    if (email) updateData.email = email;
    if (contact_number) updateData.contact_number = contact_number;
    if (principal_name) updateData.principal_name = principal_name;
    if (web_link) updateData.web_link = web_link;

    const updatedSchool = await prisma.school.update({
      where: { school_id: Number(id) },
      data: updateData,
    });

    res.status(200).json({
      message: "School updated successfully",
      school: updatedSchool,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "School ID is required" });
      return;
    }

    const students = await prisma.student.findMany({
      where: { school_id: Number(id) },
      select: {
        student_id: true,
        name: true,
        profile_picture: true,
        about: true,
      },
    });

    res.status(200).json({
      schoolId: Number(id),
      totalStudents: students.length,
      students,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolTeachers = (req: Request, res: Response): void => {};

export const getSchoolStatistics = (req: Request, res: Response): void => {};
