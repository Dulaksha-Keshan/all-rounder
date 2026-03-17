import { Request, Response } from "express";
import Post from "../mongoose/postModel.js";
import mongoose from "mongoose";
import { uploadToR2, deleteFromR2 } from '../utils/r2Upload.js';
import { RecommendationEngine } from "../services/RecommendationEngine.js";
import axios from "axios";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:3001";
const AUTHOR_NAME_CACHE_TTL_MS = Number(process.env.AUTHOR_NAME_CACHE_TTL_MS || 5 * 60 * 1000);
const AUTHOR_NAME_CACHE_MAX_KEYS = Number(process.env.AUTHOR_NAME_CACHE_MAX_KEYS || 5000);

type AuthorNameCacheEntry = {
  name: string | null;
  expiresAt: number;
};

const authorNameCache = new Map<string, AuthorNameCacheEntry>();

const tryParseStructuredString = (value: string): unknown | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const candidates = [trimmed, trimmed.replace(/'/g, '"')];
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // try next candidate
    }
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((part) => part.trim());
  }

  return undefined;
};

const normalizeNumericTags = (input: unknown): { tags: number[]; valid: boolean } => {
  const collected: number[] = [];
  let invalidFound = false;

  const visit = (value: unknown, depth = 0): void => {
    if (depth > 8 || value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item, depth + 1);
      }
      return;
    }

    if (typeof value === "number") {
      if (Number.isFinite(value)) {
        collected.push(value);
      } else {
        invalidFound = true;
      }
      return;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }

      const parsed = tryParseStructuredString(trimmed);
      if (parsed !== undefined) {
        visit(parsed, depth + 1);
        return;
      }

      const numericValue = Number(trimmed);
      if (Number.isFinite(numericValue)) {
        collected.push(numericValue);
      } else {
        invalidFound = true;
      }
      return;
    }

    invalidFound = true;
  };

  visit(input);

  return {
    tags: Array.from(new Set(collected)),
    valid: !invalidFound,
  };
};

//helper functions to map posts with author names and to fetch author names from user service.
const toSafePost = (post: any, authorName: string | null = null) => ({
  id: post._id,
  title: post.title,
  content: post.content,
  category: post.category,
  visibility: post.visibility,
  attachments: post.attachments,
  tags: post.tags,
  authorId: post.authorId,
  authorType: post.authorType,
  authorName,
  likeCount: post.likes?.count || 0,
  commentCount: post.commentCount || 0,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

const fetchAuthorName = async (uid: string): Promise<string | null> => {
  if (!uid) return null;

  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/firebase/${uid}`);
    return response.data?.user?.name || null;
  } catch (error) {
    // Do not fail the entire API response if profile lookup fails.
    console.error(`[PostController] Failed to fetch author name for uid ${uid}:`, error);
    return null;
  }
};

const getCachedAuthorName = (uid: string): string | null | undefined => {
  const entry = authorNameCache.get(uid);
  if (!entry) return undefined;

  if (entry.expiresAt < Date.now()) {
    authorNameCache.delete(uid);
    return undefined;
  }

  return entry.name;
};

const setCachedAuthorName = (uid: string, name: string | null): void => {
  if (!uid) return;

  if (authorNameCache.size >= AUTHOR_NAME_CACHE_MAX_KEYS) {
    const firstKey = authorNameCache.keys().next().value;
    if (firstKey) {
      authorNameCache.delete(firstKey);
    }
  }

  authorNameCache.set(uid, {
    name,
    expiresAt: Date.now() + AUTHOR_NAME_CACHE_TTL_MS,
  });
};

const fetchAuthorNamesBulk = async (uids: string[]): Promise<Map<string, string | null>> => {
  const result = new Map<string, string | null>();
  if (!uids.length) return result;

  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/users/bulk-basic`, {
      uids,
    });

    const users = Array.isArray(response.data?.users) ? response.data.users : [];
    for (const user of users) {
      if (user?.uid) {
        result.set(user.uid, user?.name ?? null);
      }
    }

    // Ensure every requested uid has a value in the map.
    for (const uid of uids) {
      if (!result.has(uid)) {
        result.set(uid, null);
      }
    }

    return result;
  } catch (error) {
    console.error("[PostController] Bulk author lookup failed, falling back to single lookups:", error);

    const entries = await Promise.all(
      uids.map(async (uid) => {
        const name = await fetchAuthorName(uid);
        return [uid, name] as const;
      })
    );

    return new Map<string, string | null>(entries);
  }
};

const mapPostsWithAuthorNames = async (posts: any[]): Promise<any[]> => {
  if (!posts.length) return [];

  const uniqueAuthorIds = Array.from(new Set(posts.map((post) => post.authorId).filter(Boolean)));
  const authorNameMap = new Map<string, string | null>();
  const uncachedAuthorIds: string[] = [];

  for (const authorId of uniqueAuthorIds) {
    const cachedName = getCachedAuthorName(authorId);
    if (cachedName !== undefined) {
      authorNameMap.set(authorId, cachedName);
      continue;
    }

    uncachedAuthorIds.push(authorId);
  }

  if (uncachedAuthorIds.length > 0) {
    const fetchedNames = await fetchAuthorNamesBulk(uncachedAuthorIds);
    for (const authorId of uncachedAuthorIds) {
      const authorName = fetchedNames.get(authorId) ?? null;
      authorNameMap.set(authorId, authorName);
      setCachedAuthorName(authorId, authorName);
    }
  }

  return posts.map((post) => toSafePost(post, authorNameMap.get(post.authorId) ?? null));
};

const mapPostWithAuthorName = async (post: any): Promise<any> => {
  const [mappedPost] = await mapPostsWithAuthorNames([post]);
  return mappedPost;
};

const mapFeedWithAuthorNames = async (feed: any[]): Promise<any[]> => {
  if (!Array.isArray(feed) || feed.length === 0) {
    return [];
  }

  const postItems = feed.filter((item) => item?.feedType === "post");
  if (postItems.length === 0) {
    return feed;
  }

  const safePosts = await mapPostsWithAuthorNames(postItems);
  const safePostById = new Map<string, any>(
    safePosts.map((post) => [String(post.id), post])
  );

  return feed.map((item) => {
    if (item?.feedType !== "post") {
      return item;
    }

    const safePost = safePostById.get(String(item._id ?? item.id));
    if (!safePost) {
      return item;
    }

    return {
      ...safePost,
      feedType: "post",
    };
  });
};




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
      tags,
    } = req.body;

    const normalizedTagsResult = normalizeNumericTags(tags);

    // Validate required body fields
    if (!title || !content || !category || normalizedTagsResult.tags.length === 0 || !normalizedTagsResult.valid) {
      res.status(400).json({
        message: "title, content, category, and valid numeric tags are required",
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
      tags: normalizedTagsResult.tags,
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

    const safePost = await mapPostWithAuthorName(post);

    res.status(201).json({
      message: "Post created successfully",
      post: safePost,
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

    const safePosts = await mapPostsWithAuthorNames(posts);

    res.status(200).json({
      message: "Posts fetched successfully",
      posts: safePosts,
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

    const safePosts = await mapPostsWithAuthorNames(posts);

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
    const safePosts = await mapPostsWithAuthorNames(posts);

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

    const safePost = await mapPostWithAuthorName(post);

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

    if (Object.prototype.hasOwnProperty.call(updateData, "tags")) {
      const normalizedTagsResult = normalizeNumericTags(updateData.tags);
      if (!normalizedTagsResult.valid) {
        res.status(400).json({
          message: "tags must contain only valid numbers",
        });
        return;
      }
      updateData.tags = normalizedTagsResult.tags;
    }

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

    const safePost = await mapPostWithAuthorName(updatedPost);

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

    const safePost = await mapPostWithAuthorName(deletedPost);

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

    const safeFeed = await mapFeedWithAuthorNames(result.feed || []);

    res.status(200).json({
      message: "Feed fetched successfully",
      ...result,
      feed: safeFeed,
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
