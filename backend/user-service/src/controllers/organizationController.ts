import { Request, Response } from "express";
import Verification from "../mongoose/verificationModel.js";
import { createUser } from "./userController.js";

import { prisma } from "../prisma.js";
//TODO: assess these 
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
      where: { organization_id: id as string },
      include: {
        admins: {
          select: {
            uid: true,
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

    const adminReq = {
      body: {
        ...admin,
        userType: "ORG_ADMIN",
        organization_id: newOrg.organization_id,
        verificationOption: "DOCUMENT",
      },
    } as Request;

    await createUser(
      adminReq,
      {
        status: () => ({ json: () => { } }),
      } as unknown as Response
    );

    res.status(201).json({
      message: "Organization and admin created successfully",
      organization: newOrg,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new admin to an existing organization
export const addAdminToOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id, admin } = req.body;

    if (!organization_id || !admin) {
      res.status(400).json({ message: "Organization ID and admin data are required" });
      return;
    }

    // Check if the organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { organization_id },
    });

    if (!existingOrg) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    // Prepare request for createUser
    const adminReq = {
      body: {
        ...admin,
        userType: "ORG_ADMIN",
        organization_id: existingOrg.organization_id,
        verificationOption: "DOCUMENT", // or whatever logic you want
      },
    } as Request;

    await createUser(
      adminReq,
      {
        status: () => ({ json: () => {} }),
      } as unknown as Response
    );

    res.status(201).json({
      message: "Admin added to the existing organization successfully",
      organization: existingOrg,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { adminId, ...updateData } = req.body;

    if (!id) {
      res.status(400).json({ message: "Organization ID is required" });
      return;
    }

    if (!adminId) {
      res.status(403).json({ message: "Admin authorization is required" });
      return;
    }

    //check whether admin exists and belongs to this organization
    const admin = await prisma.admin.findUnique({
      where: { uid: adminId },
    });

    if (
      !admin ||
      admin.adminType !== "ORG_ADMIN" ||
      admin.organization_id !== id
    ) {
      res.status(403).json({ message: "Unauthorized to update this organization" });
      return;
    }

    //protect sensitive fields
    delete updateData.organization_id;
    delete updateData.created_at;
    delete updateData.updated_at;

    const updatedOrganization = await prisma.organization.update({
      where: { organization_id: id },
      data: updateData,
    });

    res.status(200).json({
      message: "Organization updated successfully",
      organization: updatedOrganization,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
