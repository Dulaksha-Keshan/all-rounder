"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { PostEntity, CommentEntity, FeedItemEntity, Event } from '@/app/_type/type';
import { useUserStore } from './useUserStore';

// ==================== TYPES ====================
interface PaginationState {
  page: number;
  limit: number;
  totalItems?: number;
  totalPages?: number;
  hasNextPage?: boolean;
}

interface PostsSliceState {
  // Normalized storage
  postsById: Record<string, PostEntity>;
  allPostIds: string[];
  myPostIds: string[];
  userPostIdsByKey: Record<string, string[]>;
  selectedPostId: string | null;

  // List filters
  listFilter: {
    category?: string;
    visibility?: string;
  };
  
  // Loading states (minimal, optimized)
  isFetchingPosts: boolean;
  isCreatingPost: boolean;
  isUpdatingPost: boolean;
  isDeletingPost: boolean;

  // Error states (consolidated)
  error: string | null;
  
  // Optimistic updates
  pendingDeleteByPostId: Set<string>;
}

interface CommentsSliceState {
  // Normalized storage per post
  commentsByPostId: Record<string, CommentEntity[]>;
  commentPaginationByPostId: Record<string, PaginationState>;

  // Loading states
  isFetchingCommentsByPostId: Set<string>;
  isAddingCommentByPostId: Set<string>;
  isDeletingCommentById: Set<string>;

  // Optimistic
  pendingCommentCreateByPostId: Record<string, string[]>;
  pendingCommentDeleteById: Set<string>;
}

interface FeedSliceState {
  feedItems: FeedItemEntity[];
  feedPagination: PaginationState;
  isFetchingFeed: boolean;
}

interface CreateDraftState {
  title: string;
  content: string;
  category: "achievement" | "participation" | "event" | "project" | "";
  visibility: "public" | "private";
  tags: string[];
  files: File[];
  uploadPreviewUrls: string[];
  validationErrors: Record<string, string>;
}

interface PostStoreState extends PostsSliceState, CommentsSliceState, FeedSliceState {
  createDraft: CreateDraftState;

  // ==================== POSTS ACTIONS ====================
  fetchAllPosts: (options?: { category?: string; visibility?: string }) => Promise<void>;
  fetchMyPosts: (options?: { category?: string; visibility?: string }) => Promise<void>;
  fetchUserPosts: (userId: string, options?: { category?: string }) => Promise<void>;
  fetchPostById: (postId: string) => Promise<PostEntity | undefined>;
  
  createPost: (data: FormData) => Promise<PostEntity | undefined>;
  updatePost: (postId: string, data: FormData) => Promise<PostEntity | undefined>;
  deletePost: (postId: string) => Promise<void>;

  // ==================== LIKE ACTIONS ====================
  toggleLike: (postId: string) => Promise<void>;

  // ==================== COMMENTS ACTIONS ====================
  fetchComments: (postId: string, page?: number, limit?: number) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;

  // ==================== FEED ACTIONS ====================
  fetchFeed: (page?: number, limit?: number) => Promise<void>;

  // ==================== DRAFT ACTIONS ====================
  setCreateDraftField: (field: keyof CreateDraftState, value: any) => void;
  setCreateDraftFiles: (files: File[]) => void;
  resetCreateDraft: () => void;
  setValidationError: (field: string, error: string) => void;

  // ==================== HELPERS ====================
  normalizePost: (post: any) => PostEntity;
  normalizeComment: (comment: any) => CommentEntity;
  getPostById: (postId: string) => PostEntity | undefined;
  getCommentsByPostId: (postId: string) => CommentEntity[];
  setError: (error: string | null) => void;
}

// ==================== NORMALIZER ====================
/**
 * Normalize posts from different API responses into consistent PostEntity shape.
 * Handles: _id vs id, likes vs likeCount, likes.count, etc.
 */
const normalizePost = (post: any): PostEntity => {
  return {
    id: post.id || post._id,
    title: post.title || "",
    content: post.content || "",
    category: post.category || post.postType || "",
    visibility: post.visibility || "public",
    attachments: post.attachments || [],
    tags: post.tags || [],
    likeCount: post.likeCount ?? post.likes?.count ?? post.likes ?? 0,
    commentCount: post.commentCount ?? post.comments ?? 0,
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt,
    authorId: post.authorId || post.author?.id,
    authorType: post.authorType,
    likesUserIds: post.likes?.userIds,
    isDeleted: post.isDeleted,
  };
};

const normalizeComment = (comment: any): CommentEntity => {
  return {
    id: comment.id || comment._id,
    postId: comment.postId || comment.post_id,
    userId: comment.userId || comment.user_id,
    comment: comment.comment || comment.text || "",
    createdAt: comment.createdAt || new Date().toISOString(),
  };
};

// ==================== STORE ====================
export const usePostStore = create<PostStoreState>()(
  persist(
    (set, get) => ({
      // ==================== INITIAL STATE ====================
      
      // Posts slice
      postsById: {},
      allPostIds: [],
      myPostIds: [],
      userPostIdsByKey: {},
      selectedPostId: null,
      listFilter: {},
      isFetchingPosts: false,
      isCreatingPost: false,
      isUpdatingPost: false,
      isDeletingPost: false,
      error: null,
      pendingDeleteByPostId: new Set(),

      // Comments slice
      commentsByPostId: {},
      commentPaginationByPostId: {},
      isFetchingCommentsByPostId: new Set(),
      isAddingCommentByPostId: new Set(),
      isDeletingCommentById: new Set(),
      pendingCommentCreateByPostId: {},
      pendingCommentDeleteById: new Set(),

      // Feed slice
      feedItems: [],
      feedPagination: { page: 1, limit: 10 },
      isFetchingFeed: false,

      // Draft
      createDraft: {
        title: "",
        content: "",
        category: "",
        visibility: "public",
        tags: [],
        files: [],
        uploadPreviewUrls: [],
        validationErrors: {},
      },

      //  NORMALIZERS 
      normalizePost,
      normalizeComment,

      //  GETTERS 
      getPostById: (postId) => {
        return get().postsById[postId];
      },

      getCommentsByPostId: (postId) => {
        return get().commentsByPostId[postId] || [];
      },

      //  ERROR HANDLING 
      setError: (error) => {
        set({ error });
      },

      //  POSTS: FETCH ALL 
      fetchAllPosts: async (options = {}) => {
        set({ isFetchingPosts: true, error: null });
        try {
          const response = await api.get("/posts", { params: options });
          const posts = Array.isArray(response.data) ? response.data : response.data.posts || [];
          
          const normalized = posts.map(normalizePost);
          const postsById: Record<string, PostEntity> = {};
          const postIds: string[] = [];

          normalized.forEach((post: PostEntity) => {
            postsById[post.id] = post;
            postIds.push(post.id);
          });

          set({
            postsById: { ...get().postsById, ...postsById },
            allPostIds: postIds,
            listFilter: options,
            isFetchingPosts: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || error.message;
          set({ error: message, isFetchingPosts: false });
        }
      },

      // POSTS: FETCH MY POSTS 
      fetchMyPosts: async (options = {}) => {
        set({ isFetchingPosts: true, error: null });
        try {
          const response = await api.get("/posts/me", { params: options });
          const posts = response.data || [];

          const normalized = posts.map(normalizePost);
          const postsById: Record<string, PostEntity> = {};
          const myPostIds: string[] = [];

          normalized.forEach((post: PostEntity) => {
            postsById[post.id] = post;
            myPostIds.push(post.id);
          });

          set({
            postsById: { ...get().postsById, ...postsById },
            myPostIds,
            isFetchingPosts: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || error.message;
          set({ error: message, isFetchingPosts: false });
        }
      },

      // ==================== POSTS: FETCH USER POSTS ====================
      fetchUserPosts: async (userId, options = {}) => {
        set({ isFetchingPosts: true, error: null });
        try {
          const response = await api.get(`/posts/user/${userId}`, { params: options });
          const posts = response.data || [];

          const normalized = posts.map(normalizePost);
          const postsById: Record<string, PostEntity> = {};
          const userPostIds: string[] = [];

          normalized.forEach((post: PostEntity) => {
            postsById[post.id] = post;
            userPostIds.push(post.id);
          });

          set({
            postsById: { ...get().postsById, ...postsById },
            userPostIdsByKey: {
              ...get().userPostIdsByKey,
              [userId]: userPostIds,
            },
            isFetchingPosts: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || error.message;
          set({ error: message, isFetchingPosts: false });
        }
      },

      // ==================== POSTS: FETCH DETAIL ====================
      fetchPostById: async (postId) => {
        set({ isFetchingPosts: true, error: null });
        try {
          const response = await api.get(`/posts/${postId}`);
          const post = response.data.post || response.data;
          const normalized = normalizePost(post);

          set({
            postsById: { ...get().postsById, [normalized.id]: normalized },
            selectedPostId: normalized.id,
            isFetchingPosts: false,
          });

          return normalized;
        } catch (error: any) {
          const message = error.response?.data?.message || error.message;
          set({ error: message, isFetchingPosts: false });
          return undefined;
        }
      },

      // ==================== POSTS: CREATE ====================
      createPost: async (formData) => {
        set({ isCreatingPost: true, error: null });
        try {
          const response = await api.post("/posts", formData);
          const post = response.data;
          const normalized = normalizePost(post);

          // Get current user ID for myPostIds
          const currentUserId = useUserStore.getState().currentUser?.uid;

          set((state) => ({
            postsById: { ...state.postsById, [normalized.id]: normalized },
            myPostIds: currentUserId ? [normalized.id, ...state.myPostIds] : state.myPostIds,
            allPostIds: [normalized.id, ...state.allPostIds],
            isCreatingPost: false,
            createDraft: {
              title: "",
              content: "",
              category: "",
              visibility: "public",
              tags: [],
              files: [],
              uploadPreviewUrls: [],
              validationErrors: {},
            },
          }));

          return normalized;
        } catch (error: any) {
          const message = error.response?.data?.message || error.message;
          set({ error: message, isCreatingPost: false });
          return undefined;
        }
      },

      // ==================== POSTS: UPDATE ====================
      updatePost: async (postId, formData) => {
        set({ isUpdatingPost: true, error: null });
        try {
          const response = await api.put(`/posts/${postId}`, formData);
          const post = response.data;
          const normalized = normalizePost(post);

          set((state) => ({
            postsById: { ...state.postsById, [normalized.id]: normalized },
            isUpdatingPost: false,
          }));

          return normalized;
        } catch (error: any) {
          const message = error.response?.data?.message || error.message;
          set({ error: message, isUpdatingPost: false });
          return undefined;
        }
      },

      // ==================== POSTS: DELETE ====================
      deletePost: async (postId) => {
        set((state) => ({
          pendingDeleteByPostId: new Set([...state.pendingDeleteByPostId, postId]),
          isDeletingPost: true,
          error: null,
        }));
        try {
          await api.delete(`/posts/${postId}`);

          set((state) => ({
            postsById: (({ [postId]: _, ...rest }) => rest)(state.postsById),
            myPostIds: state.myPostIds.filter((id) => id !== postId),
            allPostIds: state.allPostIds.filter((id) => id !== postId),
            feedItems: state.feedItems.filter((item) => item.id !== postId),
            userPostIdsByKey: Object.fromEntries(
              Object.entries(state.userPostIdsByKey).map(([key, ids]) => [
                key,
                ids.filter((id) => id !== postId),
              ])
            ),
            commentsByPostId: (({ [postId]: _, ...rest }) => rest)(state.commentsByPostId),
            commentPaginationByPostId: (({ [postId]: _, ...rest }) => rest)(state.commentPaginationByPostId),
            pendingDeleteByPostId: new Set([...state.pendingDeleteByPostId].filter((id) => id !== postId)),
            isDeletingPost: false,
          }));
        } catch (error: any) {
          const message = error.response?.data?.message || error.message;
          set((state) => ({
            pendingDeleteByPostId: new Set([...state.pendingDeleteByPostId].filter((id) => id !== postId)),
            error: message,
            isDeletingPost: false,
          }));
        }
      },

      // ==================== LIKES: TOGGLE ====================
      toggleLike: async (postId) => {
        set((state) => ({
          postsById: {
            ...state.postsById,
            [postId]: state.postsById[postId]
              ? {
                  ...state.postsById[postId],
                  likeCount:
                    (state.postsById[postId].likeCount || 0) +
                    (state.postsById[postId].likesUserIds?.length === 1 ? -1 : 1),
                }
              : state.postsById[postId],
          },
          error: null,
        }));

        try {
          const response = await api.post(`/posts/${postId}/like`);
          // Backend returns { message, likeCount }
          const likeCount = response.data.likeCount ?? get().postsById[postId]?.likeCount ?? 0;

          set((state) => ({
            postsById: {
              ...state.postsById,
              [postId]: state.postsById[postId]
                ? { ...state.postsById[postId], likeCount }
                : state.postsById[postId],
            },
          }));
        } catch (error: any) {
          // Revert optimistic update
          const post = get().postsById[postId];
          set((state) => ({
            postsById: {
              ...state.postsById,
              [postId]: post
                ? { ...post, likeCount: (post.likeCount || 0) - 1 }
                : post,
            },
            error: error.response?.data?.message || error.message,
          }));
        }
      },

      // ==================== COMMENTS: FETCH ====================
      fetchComments: async (postId, page = 1, limit = 10) => {
        const key = `${postId}`;
        set((state) => ({
          isFetchingCommentsByPostId: new Set([...state.isFetchingCommentsByPostId, key]),
          error: null,
        }));

        try {
          const response = await api.get(`/posts/${postId}/comments`, {
            params: { page, limit },
          });
          // Backend returns { comments: [], totalComments, page, totalPages }
          const comments = (response.data.comments || []).map(normalizeComment);
          const pagination = {
            page: response.data.page || page,
            limit,
            totalItems: response.data.totalComments,
            totalPages: response.data.totalPages,
            hasNextPage: page < (response.data.totalPages || 1),
          };

          set((state) => ({
            commentsByPostId: {
              ...state.commentsByPostId,
              [postId]: comments,
            },
            commentPaginationByPostId: {
              ...state.commentPaginationByPostId,
              [postId]: pagination,
            },
            isFetchingCommentsByPostId: new Set(
              [...state.isFetchingCommentsByPostId].filter((k) => k !== key)
            ),
          }));
        } catch (error: any) {
          const message = error.response?.data?.message || error.message;
          set((state) => ({
            error: message,
            isFetchingCommentsByPostId: new Set(
              [...state.isFetchingCommentsByPostId].filter((k) => k !== key)
            ),
          }));
        }
      },

      // ==================== COMMENTS: ADD ====================
      addComment: async (postId, text) => {
        const tempId = `temp-${Date.now()}`;
        const tempComment: CommentEntity = {
          id: tempId,
          postId,
          userId: useUserStore.getState().currentUser?.uid || "",
          comment: text,
          createdAt: new Date().toISOString(),
        };

        // Optimistic update
        set((state) => ({
          commentsByPostId: {
            ...state.commentsByPostId,
            [postId]: [tempComment, ...(state.commentsByPostId[postId] || [])],
          },
          postsById: {
            ...state.postsById,
            [postId]: state.postsById[postId]
              ? {
                  ...state.postsById[postId],
                  commentCount: (state.postsById[postId].commentCount || 0) + 1,
                }
              : state.postsById[postId],
          },
          error: null,
        }));

        try {
          const response = await api.post(`/posts/${postId}/comments`, { text });
          // Backend returns { message, comment: { id, comment, userId, createdAt }, commentCount }
          const newComment = normalizeComment({
            ...response.data.comment,
            postId,
          });
          const commentCount = response.data.commentCount ?? 0;

          set((state) => ({
            commentsByPostId: {
              ...state.commentsByPostId,
              [postId]: [
                newComment,
                ...(state.commentsByPostId[postId] || []).filter((c) => c.id !== tempId),
              ],
            },
            postsById: {
              ...state.postsById,
              [postId]: state.postsById[postId]
                ? { ...state.postsById[postId], commentCount }
                : state.postsById[postId],
            },
          }));
        } catch (error: any) {
          // Revert optimistic update
          set((state) => ({
            commentsByPostId: {
              ...state.commentsByPostId,
              [postId]: (state.commentsByPostId[postId] || []).filter((c) => c.id !== tempId),
            },
            postsById: {
              ...state.postsById,
              [postId]: state.postsById[postId]
                ? {
                    ...state.postsById[postId],
                    commentCount: Math.max((state.postsById[postId].commentCount || 1) - 1, 0),
                  }
                : state.postsById[postId],
            },
            error: error.response?.data?.message || error.message,
          }));
        }
      },

      // ==================== COMMENTS: DELETE ====================
      deleteComment: async (postId, commentId) => {
        set((state) => ({
          pendingCommentDeleteById: new Set([...state.pendingCommentDeleteById, commentId]),
          error: null,
        }));

        try {
          const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
          // Backend returns { message, commentCount }
          const commentCount = response.data.commentCount ?? 0;

          set((state) => ({
            commentsByPostId: {
              ...state.commentsByPostId,
              [postId]: (state.commentsByPostId[postId] || []).filter((c) => c.id !== commentId),
            },
            postsById: {
              ...state.postsById,
              [postId]: state.postsById[postId]
                ? { ...state.postsById[postId], commentCount }
                : state.postsById[postId],
            },
            pendingCommentDeleteById: new Set(
              [...state.pendingCommentDeleteById].filter((id) => id !== commentId)
            ),
          }));
        } catch (error: any) {
          set((state) => ({
            pendingCommentDeleteById: new Set(
              [...state.pendingCommentDeleteById].filter((id) => id !== commentId)
            ),
            error: error.response?.data?.message || error.message,
          }));
        }
      },

      // ==================== FEED: FETCH ====================
      fetchFeed: async (page = 1, limit = 10) => {
        set({ isFetchingFeed: true, error: null });
        try {
          const response = await api.get("/posts/feed", { params: { page, limit } });
          // Backend returns { feed: [...], pagination: { currentPage, limit, totalItems, totalPages, hasNextPage } }
          const feedData = response.data.feed || [];
          const paginationData = response.data.pagination || {};

          // Process feed items - can be posts or events
          const feedItems: FeedItemEntity[] = feedData.map((item: any) => ({
            id: item.id || item._id,
            feedType: item.feedType || "post",
            data: normalizePost(item),
            createdAt: item.createdAt,
          }));

          // Also upsert posts into postsById
          const postsById: Record<string, PostEntity> = {};
          feedItems.forEach((item) => {
            if (item.feedType === "post" && item.data) {
              postsById[item.id] = item.data as PostEntity;
            }
          });

          set({
            feedItems,
            postsById: { ...get().postsById, ...postsById },
            feedPagination: {
              page: paginationData.currentPage || page,
              limit,
              totalItems: paginationData.totalItems,
              totalPages: paginationData.totalPages,
              hasNextPage: paginationData.hasNextPage,
            },
            isFetchingFeed: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || error.message;
          set({ error: message, isFetchingFeed: false });
        }
      },

      // ==================== DRAFT: MANAGEMENT ====================
      setCreateDraftField: (field, value) => {
        set((state) => ({
          createDraft: { ...state.createDraft, [field]: value },
        }));
      },

      setCreateDraftFiles: (files) => {
        const previews = files.map((f) => URL.createObjectURL(f));
        set((state) => ({
          createDraft: { ...state.createDraft, files, uploadPreviewUrls: previews },
        }));
      },

      resetCreateDraft: () => {
        set((state) => ({
          createDraft: {
            title: "",
            content: "",
            category: "",
            visibility: "public",
            tags: [],
            files: [],
            uploadPreviewUrls: [],
            validationErrors: {},
          },
        }));
      },

      setValidationError: (field, error) => {
        set((state) => ({
          createDraft: {
            ...state.createDraft,
            validationErrors: { ...state.createDraft.validationErrors, [field]: error },
          },
        }));
      },
    }),
    {
      name: "post-storage",
      // Only persist essential data, not temp states
      partialize: (state) => ({
        postsById: state.postsById,
        allPostIds: state.allPostIds,
        myPostIds: state.myPostIds,
        commentsByPostId: state.commentsByPostId,
        feedItems: state.feedItems,
      }),
    }
  )
);
