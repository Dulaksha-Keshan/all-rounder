import { Request, Response } from "express";
import { createUser } from "./userController.js";
import { UserType } from "@prisma/client";
import { prisma } from "../prisma.js";


//in the resgistration form coming from frontend will contain school registration info and admin registration info (id of school will come to admin)
//create the school profile first

export const createSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { school, admin } = req.body;

    if (!school || !admin) {
      res.status(400).json({ message: "School and admin data are required" });
      return;
    }

    //we have a separate db for schools and first we have to find whether that school is in our db (postgresql)

    const createdSchool = await prisma.school.create({
      data: {
        name: school.name as string,
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
        userType: UserType.SCHOOL_ADMIN,
        school_id: createdSchool.school_id,
      },
    } as Request;

    await createUser(
      adminReq,
      {
        status: () => ({ json: () => { } }),
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

export const listSchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const schools = await prisma.school.findMany({
      select: {
        school_id: true,
        name: true,
        district: true,
        principal_name: true,
        web_link: true,
        created_at: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      totalSchools: schools.length,
      schools,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "School ID is required" });
      return;
    }

    const school = await prisma.school.findUnique({
      where: { school_id: id as string },
      select: {
        school_id: true,
        name: true,
        district: true,
        web_link: true,
      },
    });

    if (!school) {
      res.status(404).json({ message: "School not found" });
      return;
    }

    res.status(200).json({ school });
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
    if (address) updateData.address = address; //remove the first three
    if (district) updateData.district = district;
    if (email) updateData.email = email;
    if (contact_number) updateData.contact_number = contact_number;
    if (principal_name) updateData.principal_name = principal_name;
    if (web_link) updateData.web_link = web_link;

    const updatedSchool = await prisma.school.update({
      where: { school_id: id as string },
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
      where: { school_id: id as string },
      select: {
        uid: true,
        name: true,
        profile_picture: true,
        about: true,
      },
    });

    res.status(200).json({
      schoolId: id,
      totalStudents: students.length,
      students,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolTeachers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "schoolId is required" });
      return;
    }

    const teachers = await prisma.teacher.findMany({
      where: {
        school_id: id as string,
      },
      select: {
        uid: true,
        name: true,
        subject: true,
        designation: true,
        profile_picture: true,
        created_at: true,
      },
    });

    res.status(200).json({
      count: teachers.length,
      teachers,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//TODO: add the fucntionality fetcht the admins 
export const getSchoolStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "schoolId is required" });
      return;
    }

    const [
      studentCount,
      teacherCount,
      adminCount,
      skillsCount,
    ] = await Promise.all([
      prisma.student.count({
        where: { school_id: id as string },
      }),

      prisma.teacher.count({
        where: { school_id: id as string },
      }),

      prisma.admin.count({
        where: { school_id: id as string },
      }),

      prisma.skill.count({
        where: {
          students: {
            some: {
              school_id: id as string,
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      schoolId: id,
      statistics: {
        students: studentCount,
        teachers: teacherCount,
        admins: adminCount,
        skills: skillsCount,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
