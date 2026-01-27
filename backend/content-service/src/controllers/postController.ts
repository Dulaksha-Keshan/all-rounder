import { Request, Response } from "express";

export const createPost = (req: Request, res: Response): void => {};

export const getAllPosts = (req: Request, res: Response): void => {};

export const getPostById = (req: Request, res: Response): void => {};

export const updatePost = (req: Request, res: Response): void => {};

export const deletePost = (req: Request, res: Response): void => {};


// To fetch a mix of posts for the home screen
export const getFeed = async (req: Request, res: Response): Promise<void> => {};
