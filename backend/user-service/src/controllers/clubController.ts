import { Request, Response } from "express";
import Club from "../mongoose/clubModel.js";
import { UserType } from "@prisma/client";


export const getAllClubs = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolId = req.headers['x-school-id'];
    if (!schoolId) {
      res.status(400).json({
        message: "School Id is required"
      })
      return;
    }

    const clubs = await Club.find({ schoolId: schoolId as string }).sort({ createdAt: -1 });
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
    const createdBy = req.headers["x-user-id"] as string;

    if (!userType || !createdBy) {
      res.status(400).json({
        message: "x-User-type and x-User-id headers are required",
      });
      return;
    }

    if (userType !== UserType.SUPER_ADMIN && userType !== UserType.SCHOOL_ADMIN) {
      res.status(403).json({
        message: "Only Admins can create clubs",
      });
      return;
    }

    const {
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
    } = req.body;

    if (!name || !description || !category || !schoolName || !teacherInCharge?.name) {
      res.status(400).json({
        message: "Required club fields are missing",
      });
      return;
    }

    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      res.status(409).json({
        message: "Club with this name already exists",
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

//do we need a soft delete or a hard delete here

export const deleteClub = async (req: Request, res: Response): Promise<void> => {
  try {
    const clubId = req.params.id;

    if (!clubId) {
      res.status(400).json({
        message: "Club ID is required",
      });
      return;
    }

    const deletedClub = await Club.findByIdAndDelete(clubId);

    if (!deletedClub) {
      res.status(404).json({
        message: "Club not found",
      });
      return;
    }

    res.status(200).json({
      message: "Club deleted successfully",
      club: deletedClub,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
