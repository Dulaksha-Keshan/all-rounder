import { Request, Response } from "express";
import mongoose from "mongoose";
import ResourceRequest from "../mongoose/resourceRequestModel.js";

export const createResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const creatorId = req.headers["x-User-id"] as string;

    if (!creatorId) {
      res.status(400).json({
        message: "x-user-id header is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      res.status(400).json({
        message: "Invalid user ID",
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
    });

    res.status(201).json({
      message: "Resource request created successfully",
      resourceRequest,
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
  res: Response,
): Promise<void> => {
  try {
    const { status, resourceType, visibility } = req.query;

    const filter: Record<string, any> = {};

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
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json({
      message: "Resources fetched successfully",
      count: resources.length,
      resources,
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
  res: Response,
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

    const resource = await ResourceRequest.findById(id)
      .populate("createdBy", "name email");

    if (!resource) {
      res.status(404).json({
        message: "Resource not found",
      });
      return;
    }

    res.status(200).json({
      message: "Resource fetched successfully",
      resource,
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

    const updatedResource = await ResourceRequest.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      res.status(404).json({ message: "Resource request not found" });
      return;
    }

    res.status(200).json(updatedResource);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update resource request",
      error,
    });
  }
};

export const deleteResource = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedResource = await ResourceRequest.findByIdAndDelete(id);

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

    res.status(200).json({
      message: "Resource requests fetched successfully",
      count: resources.length,
      resources,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};