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
    createPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'time' | 'createdAt' | 'updatedAt' | 'isLiked'>) => Promise<void>;
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
                            // This is a simplified optimistic update. 
                            // In reality, we'd need the current user's ID to add/remove from the array.
                            // For now, we'll assume the backend handles the actual toggling and return state as is or fetch updated.
                            // Or simpler: just don't do optimistic update for the array content without user ID, 
                            // just wait for re-fetch or assume success if needed.
                            // Let's rely on re-fetching or simple toggle if we had user ID.
                            return p;
                        }
                        return p;
                    })
                }));

                try {
                    await api.post(`/posts/${id}/like`);
                    // Ideally fetch updated post here
                    const response = await api.get(`/posts/${id}`);
                    set((state) => ({
                        posts: state.posts.map(p => p.id === id ? response.data : p)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to like post' });
                }
            },

            commentPost: async (id, text) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post(`/posts/${id}/comments`, { text });
                    // Backend should return the new comment or updated post
                    // Assuming it returns the updated post for simplicity
                    const updatedPost = response.data; // or fetch if needed

                    set((state) => ({
                        posts: state.posts.map(p => {
                            if (p.id === id) {
                                return updatedPost; // Replace with updated post from backend
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
