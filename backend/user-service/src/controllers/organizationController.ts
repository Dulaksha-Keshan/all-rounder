import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/extension";
import Verification from "../mongoose/verificationModel.js";
const prisma = new PrismaClient();

export const listOrganizations = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizations = await prisma.organization.findMany({
      select: {
        organization_id: true,
        organization_name: true,
        contact_person: true,
        website: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      count: organizations.length,
      organizations,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Organization ID is required" });
      return;
    }

    const organization = await prisma.organization.findUnique({
      where: { organization_id: Number(id) },
      include: {
        admins: {
          select: {
            admin_id: true,
            name: true,
            email: true,
            adminType: true,
            created_at: true,
          },
        },
      },
    });

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.status(200).json({
      organization: {
        organization_id: organization.organization_id,
        organization_name: organization.organization_name,
        contact_person: organization.contact_person,
        website: organization.website,
        created_at: organization.created_at,
        admins: organization.admins,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

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