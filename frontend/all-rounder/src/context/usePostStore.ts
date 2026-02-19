"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { Post } from '@/app/_type/type';

interface PostState {
    posts: Post[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchPosts: () => Promise<void>;
    createPost: (post: Omit<Post, '_id' | 'likes' | 'comments' | 'time' | 'createdAt' | 'updatedAt' | 'isLiked'>) => Promise<void>;
    getPostById: (id: string) => Promise<Post | undefined>;
    deletePost: (id: string) => Promise<void>;
    likePost: (id: string) => Promise<void>;
    commentPost: (id: string, text: string) => Promise<void>;
    setPosts: (posts: Post[]) => void;
}

export const usePostStore = create<PostState>()(
    persist(
        (set) => ({
            posts: [],
            isLoading: false,
            error: null,

            fetchPosts: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/posts');
                    set({ posts: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch posts' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setPosts: (posts) => set({ posts }),

            createPost: async (postData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/posts', postData);
                    const newPost = response.data;

                    set((state) => ({ posts: [newPost, ...state.posts] }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create post' });
                } finally {
                    set({ isLoading: false });
                }
            },

            getPostById: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/posts/${id}`);
                    const post = response.data.post;

                    set((state) => ({
                        posts: state.posts.some(p => p._id === id)
                            ? state.posts.map(p => p._id === id ? post : p)
                            : [...state.posts, post]
                    }));

                    return post;
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch post' });
                    return undefined;
                } finally {
                    set({ isLoading: false });
                }
            },

            deletePost: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/posts/${id}`);

                    set((state) => ({
                        posts: state.posts.filter(p => p._id !== id)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete post' });
                } finally {
                    set({ isLoading: false });
                }
            },

            likePost: async (id) => {
                // Simplified optimistic update - toggle implementation would require user ID
                try {
                    await api.post(`/posts/${id}/like`);
                    // Fetch updated post to ensure sync
                    const response = await api.get(`/posts/${id}`);
                    set((state) => ({
                        posts: state.posts.map(p => p._id === id ? response.data.post : p)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to like post' });
                }
            },

            commentPost: async (id, text) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post(`/posts/${id}/comments`, { text });
                    // Backend returns updated post or new comment. Assuming updated post or we fetch it.
                    // If backend returns the comment, we need to append it. If post, replace it.
                    // Based on previous code assumption, let's assume we re-fetch or backend returns post.
                    // For safety, let's fetch the post again to be sure of state
                    const postResponse = await api.get(`/posts/${id}`);
                    const updatedPost = postResponse.data.post;

                    set((state) => ({
                        posts: state.posts.map(p => {
                            if (p._id === id) {
                                return updatedPost;
                            }
                            return p;
                        })
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to comment post' });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'post-storage',
        }
    )
);
