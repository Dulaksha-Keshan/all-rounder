import { Request, Reponse } from "express";

// Handles file storage
export const uploadResource = async (
  req: Request,
  res: Response,
): Promise<void> => {};

// To filter subjects or tags
export const searchResources = async (
  req: Request,
  res: Response,
): Promise<void> => {};

// to track how many times a file was accessed
export const downloadResource = async (
  req: Request,
  res: Response,
): Promise<void> => {};
