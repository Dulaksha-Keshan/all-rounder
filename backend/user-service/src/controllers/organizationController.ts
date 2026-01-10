import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/extension";
import Verification from "../mongoose/verificationModel.js";
const prisma = new PrismaClient();

export const listOrganizations = (req: Request, res: Response): void => {};

export const getOrganizationById = (req: Request, res: Response): void => {};

//in the resgistration form coming from frontend will contain organization registration info and admin registration info

export const createOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_name, contact_person, website, admin } = req.body;

    if (!organization_name || !contact_person || !admin) {
      res.status(400).json({ message: "Organization info and admin info are required" });
      return;
    }

    const newOrg = await prisma.organization.create({
      data: {
        organization_name,
        contact_person,
        website: website ?? null,
      },
    });

    //create admin (all org admins use document verification)
    const { firebaseUID, userType, name, email, password, date_of_birth } = admin;

    if (!firebaseUID || !userType || !name || !email || !password || !date_of_birth) {
      res.status(400).json({ message: "All admin fields are required" });
      return;
    }

    const newAdmin = await prisma.admin.create({
      data: {
        firebaseUID,
        name,
        email,
        password,
        adminType: userType, //should be ORG_ADMIN
        date_of_birth: new Date(date_of_birth),
        organization_id: newOrg.organization_id,
      },
    });

    // Create verification record
    await Verification.create({
      userId: newAdmin.admin_id,
      userType: "ADMIN",
      verificationMethod: "DOCUMENT_AI",
    });

    res.status(201).json({
      message: "Organization and admin created successfully",
      organization: newOrg,
      admin: newAdmin,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrganization = (req: Request, res: Response): void => {};