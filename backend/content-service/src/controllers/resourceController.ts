import { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import ResourceRequest from "../mongoose/resourceRequestModel.js";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:3001";

type SchoolProfile = {
  school_id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  contact_number: string;
};

const getSchoolProfile = async (schoolId: string): Promise<SchoolProfile | null> => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/schools/internal/${schoolId}/resource-profile`,
      { timeout: 2500 }
    );

    return response.data?.school ?? null;
  } catch (error) {
    console.error(`[ResourceController] Failed to fetch school profile for ${schoolId}:`, error);
    return null;
  }
};

const enrichResourceWithSchool = async (request: any): Promise<{ request: any; school: SchoolProfile | null }> => {
  const school = request?.schoolId ? await getSchoolProfile(request.schoolId) : null;
  return { request, school };
};

export const createResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const creatorId = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;
    const schoolId = req.headers["x-school-id"] as string;

    if (!creatorId) {
      res.status(400).json({
        message: "x-user-uid header is required",
      });
      return;
    }

    if (userType !== "SCHOOL_ADMIN") {
      res.status(403).json({
        message: "Only SCHOOL_ADMIN can create resource requests",
      });
      return;
    }

    if (!schoolId) {
      res.status(400).json({
        message: "x-school-id header is required",
      });
      return;
    }

    const {
      title,
      description,
      resourceType,
      quantity,
      urgency,
      requestedFor,
      neededBy,
      visibility,
      remarks,
      contactNumber,
      email,
    } = req.body;

    if (!title || !description || !resourceType || !requestedFor) {
      res.status(400).json({
        message: "Missing required resource fields",
      });
      return;
    }

    if (quantity && quantity < 1) {
      res.status(400).json({
        message: "Quantity must be at least 1",
      });
      return;
    }

    const resourceRequest = await ResourceRequest.create({
      title,
      description,
      resourceType,
      quantity,
      urgency,
      requestedFor,
      neededBy,
      visibility,
      remarks,
      contactNumber,
      email,
      createdBy: creatorId,
      schoolId,
    });

    const enrichedResponse = await enrichResourceWithSchool(resourceRequest);

    res.status(201).json({
      message: "Resource request created successfully",
      ...enrichedResponse,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getAllResources = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, resourceType, visibility } = req.query;

    const filter: Record<string, any> = {
      isDeleted: false,
    };

    if (status) {
      filter.status = status;
    }

    if (resourceType) {
      filter.resourceType = resourceType;
    }

    if (visibility) {
      filter.visibility = visibility;
    }

    const resources = await ResourceRequest.find(filter)
      .sort({ createdAt: -1 });
      // .populate("createdBy", "name email");

    const schoolIds = Array.from(new Set(resources.map((resource) => resource.schoolId).filter(Boolean)));
    const schoolEntries = await Promise.all(
      schoolIds.map(async (id) => [id, await getSchoolProfile(id)] as const)
    );
    const schoolMap = new Map<string, SchoolProfile | null>(schoolEntries);

    const shapedResources = resources.map((request) => ({
      request,
      school: schoolMap.get(request.schoolId) ?? null,
    }));

    res.status(200).json({
      message: "Resources fetched successfully",
      count: shapedResources.length,
      resources: shapedResources,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getResourceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: "Invalid resource ID",
      });
      return;
    }

    const resource = await ResourceRequest.findOne({
      _id: id,
      isDeleted: false,
    });
    // .populate("createdBy", "name email");

    if (!resource) {
      res.status(404).json({
        message: "Resource not found or already deleted",
      });
      return;
    }

    const enrichedResponse = await enrichResourceWithSchool(resource);

    res.status(200).json({
      message: "Resource fetched successfully",
      ...enrichedResponse,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateResource = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedResource = await ResourceRequest.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      res.status(404).json({
        message: "Resource request not found or already deleted",
      });
      return;
    }

    res.status(200).json({
      message: "Update resource request successfully",
      updatedResource,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update resource request",
      error: error.message,
    });
  }
};


export const deleteResource = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedResource = await ResourceRequest.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!deletedResource) {
      res.status(404).json({
        message: "Resource request not found",
      });
      return;
    }

    res.status(200).json({
      message: "Resource request deleted successfully",
      resource: deletedResource,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const searchResources = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      keyword,
      resourceType,
      urgency,
      status,
      visibility,
    } = req.query;

    const filter: any = {};

    if (resourceType) filter.resourceType = resourceType;
    if (urgency) filter.urgency = urgency;
    if (status) filter.status = status;
    if (visibility) filter.visibility = visibility;

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword as string, $options: "i" } },
        { description: { $regex: keyword as string, $options: "i" } },
      ];
    }

    const resources = await ResourceRequest.find(filter).sort({
      createdAt: -1,
    });

    const schoolIds = Array.from(new Set(resources.map((resource) => resource.schoolId).filter(Boolean)));
    const schoolEntries = await Promise.all(
      schoolIds.map(async (id) => [id, await getSchoolProfile(id)] as const)
    );
    const schoolMap = new Map<string, SchoolProfile | null>(schoolEntries);

    const shapedResources = resources.map((request) => ({
      request,
      school: schoolMap.get(request.schoolId) ?? null,
    }));

    res.status(200).json({
      message: "Resource requests fetched successfully",
      count: shapedResources.length,
      resources: shapedResources,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};