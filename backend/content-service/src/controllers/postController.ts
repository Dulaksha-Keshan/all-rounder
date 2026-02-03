import { Request, Response } from "express";
import Post from "../mongoose/postModel.js"
import mongoose from "mongoose";

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.headers["x-User-id"] as string;

    if (!studentId) {
      res.status(400).json({
        message: "x-user-id header is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      res.status(400).json({
        message: "Invalid student ID",
      });
      return;
    }

    const { title, content, category, postType, visibility, attachments, tags } = req.body;

    if (!title || !content || !category) {
      res.status(400).json({
        message: "title, content, and category are required",
      });
      return;
    }

    const post = await Post.create({
      title,
      content,
      category,
      postType: postType || "achievement",
      visibility: visibility || "public",
      attachments: attachments || [],
      tags: tags || [],
      student: studentId,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, visibility } = req.query;

    const filter: any = { isDeleted: false };

    if (category) filter.category = category;
    if (visibility) filter.visibility = visibility;

    const posts = await Post.find(filter)
      .populate("student", "name profile_picture grade") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id as string;

    if (!postId) {
      res.status(400).json({
        message: "Post ID is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({
        message: "Invalid Post ID",
      });
      return;
    }

    const post = await Post.findOne({ _id: postId, isDeleted: false }).populate(
      "student",
      "name profile_picture grade"
    );

    if (!post) {
      res.status(404).json({
        message: "Post not found",
      });
      return;
    }

    res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {

    const postId =  req.params.id as string;

    if (!postId) {
      res.status(400).json({
        message: "Post ID is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({
        message: "Invalid Post ID",
      });
      return;
    }

    const updateData = { ...req.body };

    delete updateData.student; 
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.isDeleted;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, isDeleted: false },
      updateData,
      { new: true }
    );

    if (!updatedPost) {
      res.status(404).json({
        message: "Post not found or already deleted",
      });
      return;
    }

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id as string;

    if (!postId) {
      res.status(400).json({
        message: "Post ID is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({
        message: "Invalid Post ID",
      });
      return;
    }

    const deletedPost = await Post.findOneAndUpdate(
      { _id: postId, isDeleted: false }, 
      { isDeleted: true },
      { new: true }
    );

    if (!deletedPost) {
      res.status(404).json({
        message: "Post not found or already deleted",
      });
      return;
    }

    res.status(200).json({
      message: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// To fetch a mix of posts for the home screen
export const getFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    // Basic feed: return latest posts
    // In a real app, this would involve complex logic, filtering by following, etc.
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feed", error });
  }
};