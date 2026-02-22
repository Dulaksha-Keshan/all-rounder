import { Request, Response } from "express";
import Club from "../mongoose/clubModel.js";
import { UserType } from "@prisma/client";
import { prisma } from "../prisma.js";
import mongoose
  from "mongoose";

export const getAllClubs = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolId = req.headers['x-school-id'];
    if (!schoolId) {
      res.status(400).json({
        message: "School Id is required"
      })
      return;
    }

    const clubs = await Club.find({ schoolId: schoolId as string, isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({
      message: "Clubs fetched successfully",
      clubs,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


//FOR SUPER ADMINS USE  by Dulaksha 
export const getAllClubsForAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const userType = req.headers['x-user-type'];
    if (userType != UserType.SUPER_ADMIN) {
      res.status(401).json({
        message: "Unauthorized Need Super admin access"
      })
      return
    }

    const clubs = await Club.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Clubs fetched successfully",
      clubs,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getClubById = async (req: Request, res: Response): Promise<void> => {
  try {
    const clubId = req.params.id;
    const schoolId = req.headers['x-school-id'];

    if (!clubId) {
      res.status(400).json({
        message: "Club ID is required",
      });
      return;
    } else if (!schoolId) {
      res.status(400).json({
        message: "School Id is required"
      })
      return;
    }

    const club = await Club.findById(clubId);
    //Optionally we can do a find({clubId:clubId,schoolId : schoolId}) reson i didnt do it cause felt likr it would be slower on the query 
    if (!club) {
      res.status(404).json({
        message: "Club not found",
      });
      return;
    }
    if (club.schoolId !== schoolId) {
      res.status(404).json({
        message: "No such a Club found in the school",
      });
      return;
    }
    if (club.isDeleted) {
      res.status(404).json({
        message: "No such a Club found in the school",

      })
      return;
    }
    res.status(200).json({
      message: "Club fetched successfully",
      club,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createClub = async (req: Request, res: Response): Promise<void> => {
  try {
    const userType = req.headers["x-user-type"] as string;
    const createdBy = req.headers["x-user-uid"] as string;

    if (!userType || !createdBy) {
      res.status(400).json({
        message: "x-User-type and x-User-uid headers are required",
      });
      return;
    }

    if (userType !== UserType.SUPER_ADMIN && userType !== UserType.SCHOOL_ADMIN) {
      res.status(403).json({
        message: "Only Admins can create clubs",
      });
      return;
    }

    const schoolId = userType == UserType.SUPER_ADMIN ? req.body.schoolId : req.headers["x-school-id"];


    const {
      name,
      description,
      category,
      logoUrl,
      schoolName,
      foundedYear,
      teacherInCharge,
      socialLinks,
      visibility,
    } = req.body;

    if (!name || !description || !category || !schoolName || !teacherInCharge?.name || !schoolId) {
      res.status(400).json({
        message: "Required club fields are missing",
      });
      return;
    }

    const existingClub = await Club.findOne({ name, schoolId });

    if (existingClub) {
      res.status(409).json({
        message: "A club with this name already exists in your school",
      });
      return;
    }

    const club = await Club.create({
      name,
      description,
      category,
      logoUrl,
      schoolId,
      schoolName,
      foundedYear,
      teacherInCharge,
      socialLinks,
      visibility,
      createdBy,
    });

    res.status(201).json({
      message: "Club created successfully",
      club,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateClub = async (req: Request, res: Response): Promise<void> => {
  try {
    const clubId = req.params.id;
    const updateData = { ...req.body };
    const schoolId = req.headers['x-school-id']


    if (!schoolId) {
      res.status(400).json({
        message: "School ID is required",
      });
      return;
    }

    if (!clubId) {
      res.status(400).json({
        message: "Club ID is required",
      });
      return;
    }

    delete updateData.createdBy;
    delete updateData._id;

    const updatedClub = await Club.findByIdAndUpdate(clubId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedClub) {
      res.status(404).json({
        message: "Club not found",
      });
      return;
    }

    res.status(200).json({
      message: "Club updated successfully",
      club: updatedClub,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const deleteClub = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clubId = req.params.id;
    const uid = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;

    if (!clubId) {
      res.status(400).json({ message: "Club ID is required" });
      return;
    }

    if (!uid || !userType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    const club = await Club.findById(clubId);

    if (!club) {
      res.status(404).json({ message: "Club not found" });
      return;
    }

    if (club.isDeleted) {
      res.status(409).json({ message: "Club already deleted" });
      return;
    }

    if (club.createdBy.toString() !== uid) {
      res.status(403).json({
        message: "You are not authorized to delete this club",
      });
      return;
    }

    club.isDeleted = true;
    await club.save();

    res.status(200).json({
      message: "Club deleted successfully (soft delete)",
    });
  } catch (error: any) {
    console.error("Delete Club Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



export const joinClub = async (req: Request, res: Response): Promise<void> => {
  try {
    const clubId = req.params.id;
    const uid = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;
    const schoolId = req.headers["x-school-id"] as string;

    if (!clubId) {
      res.status(400).json({ message: "Club ID is required" });
      return;
    }

    if (!uid || !userType || !schoolId) {
      res.status(400).json({
        message: "x-user-uid, x-user-type and x-school-id headers are required",
      });
      return;
    }


    const club = await Club.findById(clubId);

    if (!club || club.isDeleted) {
      res.status(404).json({ message: "Club not found" });
      return;
    }

    if (club.schoolId !== schoolId) {
      res.status(403).json({
        message: "You are not allowed to join this club",
      });
      return;
    }

    // Check if already member
    const alreadyMember = club.members?.some(
      (member: any) => member.uid === uid
    );

    if (alreadyMember) {
      res.status(409).json({
        message: "User already joined this club",
      });
      return;
    }

    // Add member
    club.members.push({
      uid,
      userType,
      joinedAt: new Date(),
    });

    await club.save();

    if (userType === "STUDENT") {
      await prisma.student.update({
        where: { uid },
        data: {
          clubIds: { push: clubId }
        }
      });
    } else if (userType === "TEACHER") {
      await prisma.teacher.update({
        where: { uid },
        data: { clubIds: { push: clubId } }
      });
    }

    res.status(200).json({
      message: "Joined club successfully",
      club,
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const leaveClub = async (req: Request, res: Response): Promise<void> => {
  try {
    const clubId = req.params.id;
    const userId = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;

    if (!clubId) {
      res.status(400).json({ message: "Club ID is required" });
      return;
    }

    if (!userId || !userType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    const club = await Club.findById(clubId);

    if (!club) {
      res.status(404).json({ message: "Club not found" });
      return;
    }

    const isMember = club.members?.some(
      (member: any) => member.uid === userId
    );

    if (!isMember) {
      res.status(409).json({
        message: "User is not a member of this club",
      });
      return;
    }

    club.members.pull({ uid: userId });

    await club.save();

    if (userType === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { uid: userId },
      });

      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      await prisma.student.update({
        where: { uid: userId },
        data: {
          clubIds: {
            set: student.clubIds.filter((id: string) => id !== clubId),
          },
        },
      });
    }


    res.status(200).json({
      message: "Left club successfully",
      club,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clubId = req.params.id;

    if (!clubId) {
      res.status(400).json({
        message: "Club ID is required",
      });
      return;
    }

    const club = await Club.findById(clubId)//.select("members name");

    if (!club) {
      res.status(404).json({
        message: "Club not found",
      });
      return;
    }

    res.status(200).json({
      message: "Members fetched successfully",
      clubName: club.name,
      totalMembers: club.members.length,
      members: club.members,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};



export const getUserClubs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uid = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;

    if (!uid || !userType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    if (!["STUDENT", "TEACHER"].includes(userType)) {
      res.status(403).json({
        message: "Only students and teachers have clubs",
      });
      return;
    }

    let clubIds: string[] = [];

    if (userType === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { uid },
        select: { clubIds: true },
      });

      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      clubIds = student.clubIds;
    }

    if (userType === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({
        where: { uid },
        select: { clubIds: true },
      });

      if (!teacher) {
        res.status(404).json({ message: "Teacher not found" });
        return;
      }

      clubIds = teacher.clubIds;
    }

    if (!clubIds || clubIds.length === 0) {
      res.status(200).json({
        message: "User is not part of any clubs",
        clubs: [],
      });
      return;
    }

    const validObjectIds = clubIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const clubs = await Club.find({
      _id: { $in: validObjectIds },
      isDeleted: false,
    });

    res.status(200).json({
      message: "User clubs fetched successfully",
      count: clubs.length,
      clubs, // dont send the whole club details
    });
  } catch (error: any) {
    console.error("Get User Clubs Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
