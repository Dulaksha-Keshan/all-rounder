import { Request, Response } from "express";
import Club from "../mongoose/clubModel.js";


export const getAllClubs = (req: Request, res: Response): void => {};

export const getClubById = (req: Request, res: Response): void => {};

export const createClub = async (req: Request, res: Response): Promise<void> => {
  try {
    const userType = req.headers["x-User-type"] as string;
    const createdBy = req.headers["x-User-id"] as string;

    if (!userType || !createdBy) {
      res.status(400).json({
        message: "x-User-type and x-User-id headers are required",
      });
      return;
    }

    if (userType !== "SUPER_ADMIN") {
      res.status(403).json({
        message: "Only SUPER_ADMIN can create clubs",
      });
      return;
    }

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
export const updateClub = (req: Request, res: Response): void => {};

export const deleteClub = (req: Request, res: Response): void => {};
