import { Request, Resource } from "express";

// To creaete a post
export const createPost = async (
  req: Request,
  res: Response,
): Promise<void> => {};

// To fetch a mix of posts for the home screen
export const getFeed = async (req: Request, res: Response): Promise<void> => {};
