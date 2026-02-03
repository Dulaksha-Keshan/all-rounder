import { Request, Response } from "express";
import mongoose from "mongoose";
import ResourceRequest from "../mongoose/resourceRequestModel.js";

export const createResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const creatorId = req.headers["x-user-id"] as string;

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

export const updateResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = await ResourceRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!resource) {
      res.status(404).json({ message: "Resource request not found" });
      return;
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: "Error updating resource request", error });
  }
};

export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = await ResourceRequest.findByIdAndDelete(req.params.id);
    if (!resource) {
      res.status(404).json({ message: "Resource request not found" });
      return;
    }
    res.status(200).json({ message: "Resource request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resource request", error });
  }
};

export const searchResources = async (req: Request, res: Response): Promise<void> => {
    try {
        const { resourceType, status } = req.query;
        const query: any = {};
        if (resourceType) query.resourceType = resourceType;
        if (status) query.status = status;

        const resources = await ResourceRequest.find(query);
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: "Error searching resources", error });
    }
};