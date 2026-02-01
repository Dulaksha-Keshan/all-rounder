import { Request, Response } from "express";
<<<<<<< HEAD
import multer from "multer";
import Resource from "../mongoose/resourceModel.js";

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (keeping it under BSON 16MB limit)
  },
});

// Middleware to be used in routes
export const uploadMiddleware = upload.single("file");

// Handles file storage
export const uploadResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const { title, subject, tags, description, userId } = req.body;

    if (!title || !subject || !userId) {
      res.status(400).json({
        message: "Missing required fields: title, subject, userId",
      });
      return;
    }

    const resource = await Resource.create({
      title,
      description,
      subject,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t: string) => t.trim())
        : [],
      uploadedBy: userId,
      fileData: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName: req.file.originalname,
      },
    });

    // Don't send the huge buffer back in the response
    const { fileData, ...resourceResponse } = resource.toObject();

    res.status(201).json({
      message: "Resource uploaded successfully",
      resource: resourceResponse,
    });
  } catch (error) {
    console.error("Error uploading resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
=======

export const createResource = (req: Request, res: Response): void => {};

export const getAllResources = (req: Request, res: Response): void => {};

export const getResourceById = (req: Request, res: Response): void => {};

export const updateResource = (req: Request, res: Response): void => {};

export const deleteResource = (req: Request, res: Response): void => {};
>>>>>>> refs/remotes/origin/back-end-dev

// To filter subjects or tags
export const searchResources = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { subject, tag } = req.query;
    const query: any = {};

    if (subject) {
      query.subject = subject;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Exclude fileData from search results to keep payload light
    const resources = await Resource.find(query).select("-fileData.data");

    res.status(200).json(resources);
  } catch (error) {
    console.error("Error searching resources:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// to track how many times a file was accessed
export const downloadResource = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Resource ID is required" });
      return;
    }

    const resource = await Resource.findById(id);

    if (!resource || !resource.fileData || !resource.fileData.data) {
      res.status(404).json({ message: "Resource or file not found" });
      return;
    }

    // Increment download count
    resource.downloadCount += 1;
    await resource.save();

    // Serve the file
    res.set("Content-Type", resource.fileData.contentType || "application/octet-stream");
    res.set(
      "Content-Disposition",
      `attachment; filename="${resource.fileData.originalName || "download"}"`
    );
    res.send(resource.fileData.data);
  } catch (error) {
    console.error("Error downloading resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
