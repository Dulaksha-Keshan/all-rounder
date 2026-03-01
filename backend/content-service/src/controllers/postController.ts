import { Request, Response } from "express";
import Post from "../mongoose/postModel.js"
import mongoose from "mongoose";


export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorId = req.headers["x-user-id"] as string;
    const authorType = req.headers["x-user-type"] as string;

    // Validate headers
    if (!authorId || !authorType) {
      res.status(400).json({
        message: "x-user-id and x-user-type headers are required",
      });
      return;
    }

    if (!["STUDENT", "SCHOOL_ADMIN", "ORG_ADMIN"].includes(authorType)) {
      res.status(400).json({
        message: "x-user-type must be student, school admin, or organization admin",
      });
      return;
    }

    const { title, content, category, visibility, attachments, tags } = req.body;

    // Validate required body fields
    if (!title || !content || !category) {
      res.status(400).json({
        message: "title, content, and category are required",
      });
      return;
    }

    // Create the post
    const post = await Post.create({
      title,
      content,
      category,
      visibility: visibility || "public",
      attachments: attachments || [],
      tags: tags || [],
      authorType,
      authorId,
      likes: {
        count: 0,
        userIds: [],
      },
      comments: [],
      commentCount: 0,
      isDeleted: false,
    });

    res.status(201).json({
      message: "Post created successfully",
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        category: post.category,
        visibility: post.visibility,
        attachments: post.attachments,
        tags: post.tags,
        likeCount: post.likes.count,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// x-user-id use karala thamange porfile ekt giyama ena post tika

export const getMyPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorId = req.headers["x-user-id"] as string;
    const authorType = req.headers["x-user-type"] as string;

    // Validate headers
    if (!authorId || !authorType) {
      res.status(400).json({
        message: "x-user-id and x-user-type headers are required",
      });
      return;
    }

    if (!["STUDENT", "SCHOOL_ADMIN", "ORG_ADMIN"].includes(authorType)) {
      res.status(400).json({
        message: "x-user-type must be student, school admin, or organization admin",
      });
      return;
    }

    const { category, visibility } = req.query;
    const filter: any = {
      isDeleted: false,
      authorId,
      authorType,
    };

    if (category) filter.category = category;
    if (visibility) filter.visibility = visibility;

    // Fetch posts
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const safePosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      visibility: post.visibility,
      attachments: post.attachments,
      tags: post.tags,
      likeCount: post.likes?.count || 0,
      commentCount: post.commentCount || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    res.status(200).json({
      message: "Your posts fetched successfully",
      posts: safePosts,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

//user id ek req.params, thwa kenekge posts
 const getPostsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const userType = req.query.userType as string; 
    const { category } = req.query;

    // Validate inputs
    if (!userId || !userType) {
      res.status(400).json({
        message: "userId and userType are required",
      });
      return;
    }

    if (!["STUDENT", "SCHOOL_ADMIN", "ORG_ADMIN"].includes(userType)) {
      res.status(400).json({
        message: "userType must be student, school admin, or organization admin",
      });
      return;
    }

    const filter: any = {
      authorId: userId,
      authorType: userType,
      isDeleted: false,
      visibility: "public", // only public posts
    };

    if (category) filter.category = category;

    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();

    // Sanitize response
    const safePosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      visibility: post.visibility,
      attachments: post.attachments,
      tags: post.tags,
      likeCount: post.likes?.count || 0,
      commentCount: post.commentCount || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    res.status(200).json({
      message: "User posts fetched successfully",
      posts: safePosts,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getPostById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = req.params.id as string;
    const currentUserId = req.headers["x-user-id"] as string; // optional, can be undefined

    // Validate post ID
    if (!postId) {
      res.status(400).json({ message: "Post ID is required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid Post ID" });
      return;
    }

    // Find post
    const post = await Post.findOne({ _id: postId, isDeleted: false }).lean();

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.visibility === "private") {
      // Only author can see private posts
      if (!currentUserId || post.authorId !== currentUserId) {
        res.status(403).json({
          message: "You are not allowed to view this post",
        });
        return;
      }
    }

    const safePost = {
      id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      visibility: post.visibility,
      attachments: post.attachments,
      tags: post.tags,
      likeCount: post.likes?.count || 0,
      commentCount: post.commentCount || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    res.status(200).json({
      message: "Post fetched successfully",
      post: safePost,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    //post ek userged balann

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
    // Basic feed: return latest public posts that are not deleted
    const posts = await Post.find({ isDeleted: false, visibility: "public" })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      message: "Feed fetched successfully",
      posts,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching feed",
      error: error.message,
    });
  }
};