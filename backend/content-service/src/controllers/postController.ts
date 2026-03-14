import { Request, Response } from "express";
import Post from "../mongoose/postModel.js";
import mongoose from "mongoose";
import { uploadToR2, deleteFromR2 } from '../utils/r2Upload.js';
import { RecommendationEngine } from "../services/RecommendationEngine.js";

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const uploadedKeys: string[] = []; // For rollback
  const start = process.hrtime();
  
  try {
    const authorId = req.headers["x-user-uid"] as string;
    const authorType = req.headers["x-user-type"] as string;

    // Validate headers
    if (!authorId || !authorType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    if (!["STUDENT", "TEACHER", "SCHOOL_ADMIN", "ORG_ADMIN", "SUPER_ADMIN"].includes(authorType)) {
      res.status(400).json({
        message: "x-user-type header is invalid",
      });
      return;
    }

    const {
      title,
      content,
      category,
      visibility,
      attachments,
      tags,
    } = req.body;

    // Validate required body fields
    if (!title || !content || !category) {
      res.status(400).json({
        message: "title, content, and category are required",
      });
      return;
    }

    const validationEnd = process.hrtime(start);
    const validationTime = (validationEnd[0] * 1000 + validationEnd[1] / 1000000).toFixed(2);
    console.log(`[Performance] Post Validation & Formatting: ${validationTime}ms`);

    // Handle file uploads
    const attachmentUrls: string[] = [];
    // ... (rest of the upload logic stays the same)
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const key = `posts/${authorId}/${Date.now()}-${file.originalname}`;
          const url = await uploadToR2(file.buffer, key, file.mimetype);
          attachmentUrls.push(url);
          uploadedKeys.push(key); // Track for rollback
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          // Rollback previous uploads
          for (const key of uploadedKeys) {
            try {
              await deleteFromR2(key);
            } catch (deleteError) {
              console.error('Rollback delete failed:', deleteError);
            }
          }
          res.status(500).json({
            message: "File upload failed",
          });
          return;
        }
      }
    }

    const dbStart = process.hrtime();
    // Create the post
    const post: any = await Post.create({
      title,
      content,
      category,
      visibility: visibility || "public",
      attachments: attachmentUrls,
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
    const dbEnd = process.hrtime(dbStart);
    const dbTime = (dbEnd[0] * 1000 + dbEnd[1] / 1000000).toFixed(2);
    console.log(`[Performance] MongoDB Creation Latency: ${dbTime}ms`);

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
    // ... rest of the catch block
    console.error(error);
    // Rollback uploads if post creation failed
    for (const key of uploadedKeys) {
      try {
        await deleteFromR2(key);
      } catch (deleteError) {
        console.error('Rollback delete failed:', deleteError);
      }
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, visibility } = req.query;

    const filter: any = { isDeleted: false };
    if (category) filter.category = category;
    if (visibility) filter.visibility = visibility;

    const posts = await Post.find(filter)
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

export const getMyPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const authorId = req.headers["x-user-uid"] as string;
    const authorType = req.headers["x-user-type"] as string;

    // Validate headers
    if (!authorId || !authorType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    if (!["STUDENT", "TEACHER", "SCHOOL_ADMIN", "ORG_ADMIN", "SUPER_ADMIN"].includes(authorType)) {
      res.status(400).json({
        message: "x-user-type header is invalid",
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
export const getPostsByUser = async (
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

    if (!["STUDENT", "TEACHER", "SCHOOL_ADMIN", "ORG_ADMIN", "SUPER_ADMIN"].includes(userType)) {
      res.status(400).json({
        message: "userType must be student, teacher, school admin, or organization admin",
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
    const currentUserId = req.headers["x-user-uid"] as string; // optional, can be undefined

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
  const uploadedKeys: string[] = []; // For rollback
  try {
    const postId = req.params.id as string;
    const currentUserId = req.headers["x-user-uid"] as string;
    const currentUserType = req.headers["x-user-type"] as string;

    // Validate headers
    if (!currentUserId || !currentUserType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    if (!["STUDENT", "TEACHER", "SCHOOL_ADMIN", "ORG_ADMIN", "SUPER_ADMIN"].includes(currentUserType)) {
      res.status(400).json({
        message: "x-user-type header is invalid",
      });
      return;
    }

    // Validate post ID
    if (!postId) {
      res.status(400).json({ message: "Post ID is required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid Post ID" });
      return;
    }

    // Handle file uploads (replace attachments if new files provided)
    const attachmentUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const key = `posts/${currentUserId}/${Date.now()}-${file.originalname}`;
          const url = await uploadToR2(file.buffer, key, file.mimetype);
          attachmentUrls.push(url);
          uploadedKeys.push(key); // Track for rollback
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          // Rollback previous uploads
          for (const key of uploadedKeys) {
            try {
              await deleteFromR2(key);
            } catch (deleteError) {
              console.error('Rollback delete failed:', deleteError);
            }
          }
          res.status(500).json({
            message: "File upload failed",
          });
          return;
        }
      }
    }

    // Prevent updates to protected fields
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.isDeleted;
    delete updateData.authorId;
    delete updateData.authorType;

    // If new attachments uploaded, replace them
    if (attachmentUrls.length > 0) {
      updateData.attachments = attachmentUrls;
    }

    // Find and update post if the current user is the author
    const updatedPost = await Post.findOneAndUpdate(
      {
        _id: postId,
        isDeleted: false,
        authorId: currentUserId,
        authorType: currentUserType,
      },
      updateData,
      { new: true }
    ).lean();

    if (!updatedPost) {
      res.status(404).json({
        message: "Post not found, deleted, or you are not the author",
      });
      // Rollback uploads since update failed
      for (const key of uploadedKeys) {
        try {
          await deleteFromR2(key);
        } catch (deleteError) {
          console.error('Rollback delete failed:', deleteError);
        }
      }
      return;
    }

    const safePost = {
      id: updatedPost._id,
      title: updatedPost.title,
      content: updatedPost.content,
      category: updatedPost.category,
      visibility: updatedPost.visibility,
      attachments: updatedPost.attachments,
      tags: updatedPost.tags,
      likeCount: updatedPost.likes?.count || 0,
      commentCount: updatedPost.commentCount || 0,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };

    res.status(200).json({
      message: "Post updated successfully",
      post: safePost,
    });
  } catch (error: any) {
    console.error(error);
    // Rollback uploads if update failed
    for (const key of uploadedKeys) {
      try {
        await deleteFromR2(key);
      } catch (deleteError) {
        console.error('Rollback delete failed:', deleteError);
      }
    }
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const postId = req.params.id as string;
    const currentUserId = req.headers["x-user-uid"] as string;
    const currentUserType = req.headers["x-user-type"] as string;

    // Validate headers
    if (!currentUserId || !currentUserType) {
      res.status(400).json({
        message: "x-user-uid and x-user-type headers are required",
      });
      return;
    }

    if (!["STUDENT", "TEACHER", "SCHOOL_ADMIN", "ORG_ADMIN", "SUPER_ADMIN"].includes(currentUserType)) {
      res.status(400).json({
        message: "x-user-type header is invalid",
      });
      return;
    }

    // Validate post ID
    if (!postId) {
      res.status(400).json({ message: "Post ID is required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid Post ID" });
      return;
    }

    // Soft delete only if the current user is the author
    const deletedPost = await Post.findOneAndUpdate(
      {
        _id: postId,
        isDeleted: false,
        authorId: currentUserId,
        authorType: currentUserType,
      },
      { isDeleted: true },
      { new: true }
    ).lean();

    if (!deletedPost) {
      res.status(404).json({
        message: "Post not found, already deleted, or you are not the author",
      });
      return;
    }

    const safePost = {
      id: deletedPost._id,
      title: deletedPost.title,
      content: deletedPost.content,
      category: deletedPost.category,
      visibility: deletedPost.visibility,
      attachments: deletedPost.attachments,
      tags: deletedPost.tags,
      likeCount: deletedPost.likes?.count || 0,
      commentCount: deletedPost.commentCount || 0,
      createdAt: deletedPost.createdAt,
      updatedAt: deletedPost.updatedAt,
    };

    res.status(200).json({
      message: "Post deleted successfully",
      post: safePost,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// To fetch a mix of posts and events for the home screen
export const getFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const userUid = req.headers["x-user-uid"] as string;
    const userType = req.headers["x-user-type"] as string;

    const result = await RecommendationEngine.getPersonalizedFeed(
      userUid,
      userType,
      page,
      limit
    );

    res.status(200).json({
      message: "Feed fetched successfully",
      ...result
    });
  } catch (error: any) {
    console.error("[PostController] Error in getFeed:", error);
    res.status(500).json({
      message: "Error fetching feed",
      error: error.message,
    });
  }
};


//Post interactions sepcific functions


export const toggleLikePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id as string;
    const currentUserId = req.headers["x-user-uid"] as string;

    // Validate headers
    if (!currentUserId) {
      res.status(400).json({ message: "x-user-uid header is required" });
      return;
    }

    // Validate postId
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid Post ID" });
      return;
    }

    // Find post
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const userIndex = post.likes.userIds.indexOf(currentUserId);

    if (userIndex === -1) {
      // User hasn't liked yet, add like
      post.likes.userIds.push(currentUserId);
      post.likes.count = post.likes.userIds.length;
      await post.save();

      res.status(200).json({
        message: "Post liked successfully",
        likeCount: post.likes.count,
      });
    } else {
      // User already liked, remove like
      post.likes.userIds.splice(userIndex, 1);
      post.likes.count = post.likes.userIds.length;
      await post.save();

      res.status(200).json({
        message: "Post unliked successfully",
        likeCount: post.likes.count,
      });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id as string;
    const currentUserId = req.headers["x-user-uid"] as string;
    const { comment } = req.body;

    // Validate headers and body
    if (!currentUserId) {
      res.status(400).json({ message: "x-user-uid header is required" });
      return;
    }

    if (!comment || comment.trim().length === 0) {
      res.status(400).json({ message: "Comment cannot be empty" });
      return;
    }

    // Validate postId
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid Post ID" });
      return;
    }

    // Find the post
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Add the comment
    const newComment = {
      userId: currentUserId,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    post.commentCount = post.comments.length;

    await post.save();

    // Get the last added comment safely
    const addedComment = post.comments[post.comments.length - 1];
    if (!addedComment) {
      res.status(500).json({ message: "Failed to add comment" });
      return;
    }

    // Safe response
    res.status(201).json({
      message: "Comment added successfully",
      comment: {
        id: addedComment._id,
        comment: addedComment.comment,
        createdAt: addedComment.createdAt,
      },
      commentCount: post.commentCount,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.postId as string;
    const commentId = req.params.commentId as string;
    const currentUserId = req.headers["x-user-uid"] as string;

    // Validate inputs
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid Post ID" });
      return;
    }

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json({ message: "Invalid Comment ID" });
      return;
    }

    if (!currentUserId) {
      res.status(400).json({ message: "x-user-uid header is required" });
      return;
    }

    // Find the post
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Find the comment index
    const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);

    if (commentIndex === -1) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const comment = post.comments[commentIndex];

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Only the comment author or post author can delete
    if (comment.userId !== currentUserId && post.authorId !== currentUserId) {
      res.status(403).json({ message: "You are not allowed to delete this comment" });
      return;
    }

    // Remove the comment
    post.comments.splice(commentIndex, 1);
    post.commentCount = post.comments.length;

    await post.save();

    res.status(200).json({
      message: "Comment deleted successfully",
      commentCount: post.commentCount,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getPostComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id as string;
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid Post ID" });
      return;
    }

    const post = await Post.findOne({ _id: postId, isDeleted: false }).lean();
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedComments = post.comments
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()) // newest first
      .slice(startIndex, endIndex)
      .map((comment: any) => ({
        id: comment._id,
        comment: comment.comment,
        userId: comment.userId,
        createdAt: comment.createdAt,
      }));

    res.status(200).json({
      message: "Comments fetched successfully",
      comments: paginatedComments,
      totalComments: post.comments.length,
      page,
      totalPages: Math.ceil(post.comments.length / limit),
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
