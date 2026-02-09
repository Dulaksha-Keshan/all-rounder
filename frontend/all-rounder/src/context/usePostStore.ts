"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

// Defining types locally to be self-contained, mirroring PostType usage
export interface Post {
    id: number;
    author: {
        name: string;
        role: string;
        image?: string;
    };
    time: string;
    content: string;
    likes: number;
    comments: number;
    isLiked?: boolean;
    media?: {
        type: 'image' | 'video' | 'doc';
        url: string;
        name: string;
    }[];
}

interface PostState {
    posts: Post[];
    isLoading: boolean;

    error: string | null;

    // Actions
    fetchPosts: () => Promise<void>;
    createPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'time'>) => Promise<void>;
    deletePost: (id: number) => Promise<void>;
    likePost: (id: number) => Promise<void>;
    commentPost: (id: number, text: string) => Promise<void>;
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

            deletePost: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/posts/${id}`);

                    set((state) => ({
                        posts: state.posts.filter(p => p.id !== id)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete post' });
                } finally {
                    set({ isLoading: false });
                }
            },

            likePost: async (id) => {
                // Optimistic update
                set((state) => ({
                    posts: state.posts.map(p => {
                        if (p.id === id) {
                            const isLiked = !p.isLiked;
                            return {
                                ...p,
                                isLiked,
                                likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
                            };
                        }
                        return p;
                    })
                }));

                try {
                    await api.post(`/posts/${id}/like`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to like post' });
                    // Could revert optimistic update
                }
            },

            commentPost: async (id, text) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post(`/posts/${id}/comments`, { text });
                    // Assuming backend returns updated comment count or the comment itself

                    set((state) => ({
                        posts: state.posts.map(p => {
                            if (p.id === id) {
                                return { ...p, comments: p.comments + 1 };
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
