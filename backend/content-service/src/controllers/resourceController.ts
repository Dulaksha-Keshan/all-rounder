import { Request, Response } from "express";

export const createResource = (req: Request, res: Response): void => {};

export const getAllResources = (req: Request, res: Response): void => {};

export const getResourceById = (req: Request, res: Response): void => {};

export const updateResource = (req: Request, res: Response): void => {};

export const deleteResource = (req: Request, res: Response): void => {};

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
