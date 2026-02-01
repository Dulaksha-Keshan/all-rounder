import { Request, Response } from "express";
import ResourceRequest from "../mongoose/resourceRequestModel.js";

export const createResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = await ResourceRequest.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: "Error creating resource request", error });
  }
};

export const getAllResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const resources = await ResourceRequest.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resource requests", error });
  }
};

export const getResourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = await ResourceRequest.findById(req.params.id);
    if (!resource) {
      res.status(404).json({ message: "Resource request not found" });
      return;
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resource request", error });
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