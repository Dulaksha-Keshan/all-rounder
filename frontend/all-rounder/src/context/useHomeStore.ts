"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PostType, Comment } from '../app/home/_components/PostCard';
import { INITIAL_POSTS } from '../app/home/constants';
import api from '@/lib/axios';

interface HomeState {
    posts: PostType[];
    drafts: PostType[];
    stats: {
        views: number;
        achievements: number;
        events: number;
        contributions: number;
    };
    isLoading: boolean;
    error: string | null;

    // Async Actions
    fetchHomeData: () => Promise<void>;
    createPost: (content: string, media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[]) => Promise<void>;
    saveDraft: (content: string, media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[]) => Promise<void>;
    deletePost: (id: number) => Promise<void>;
    deleteDraft: (id: number) => Promise<void>;
    editPost: (id: number, newContent: string) => Promise<void>;
    likePost: (id: number) => Promise<void>;
    commentPost: (id: number, text: string) => Promise<void>;
    updateStats: (key: keyof HomeState['stats'], value: number) => void; // Keep synchronous for now or make async? Probably sync is fine if it's local only, but user might want it stored. I'll leave as sync or make async if fits pattern. Let's make it sync as it seems to be a local helper? Or maybe fetch stats is part of fetchHomeData.
}

export const useHomeStore = create<HomeState>()(
    persist(
        (set, get) => ({
            posts: INITIAL_POSTS,
            drafts: [],
            stats: {
                views: 1234,
                achievements: 24,
                events: 8,
                contributions: 12
            },
            isLoading: false,
            error: null,

            fetchHomeData: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/home');
                    const data = response.data;
                    set({
                        posts: data.posts || [],
                        stats: data.stats || get().stats
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch home data' });
                } finally {
                    set({ isLoading: false });
                }
            },

            createPost: async (content, media) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/posts', { content, media });
                    set((state) => ({
                        posts: [response.data, ...state.posts],
                        stats: { ...state.stats, contributions: state.stats.contributions + 1 }
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create post' });
                } finally {
                    set({ isLoading: false });
                }
            },

            saveDraft: async (content, media) => {
                set({ isLoading: true, error: null });
                try {
                    // Assuming drafts are also saved to backend
                    const response = await api.post('/drafts', { content, media });
                    set((state) => ({
                        drafts: [response.data, ...state.drafts]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to save draft' });
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

            deleteDraft: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/drafts/${id}`);

                    set((state) => ({
                        drafts: state.drafts.filter(d => d.id !== id)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete draft' });
                } finally {
                    set({ isLoading: false });
                }
            },

            editPost: async (id, newContent) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/posts/${id}`, { content: newContent });
                    const updatedPost = response.data;

                    set((state) => ({
                        posts: state.posts.map(p =>
                            p.id === id ? { ...p, ...updatedPost } : p
                        )
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to edit post' });
                } finally {
                    set({ isLoading: false });
                }
            },

            likePost: async (id) => {
                // Optimistic update
                set((state) => ({
                    posts: state.posts.map(p => {
                        if (p.id === id) {
                            const isLiked = p.isLiked;
                            let newLikes = Array.isArray(p.likes) ? [...p.likes] : [];
                            if (isLiked) {
                                newLikes = newLikes.filter(l => l.userId !== 1);
                            } else {
                                newLikes.push({ userId: 1, name: "You" });
                            }
                            return { ...p, likes: newLikes, isLiked: !isLiked };
                        }
                        return p;
                    })
                }));

                try {
                    await api.post(`/posts/${id}/like`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to toggle like' });
                    // Could revert optimistic update here
                }
            },

            commentPost: async (id, text) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post(`/posts/${id}/comments`, { text });
                    const newComment = response.data;

                    set((state) => ({
                        posts: state.posts.map(p => {
                            if (p.id === id) {
                                return { ...p, comments: [...(Array.isArray(p.comments) ? p.comments : []), newComment] };
                            }
                            return p;
                        })
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to post comment' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateStats: (key, value) => set((state) => ({
                stats: { ...state.stats, [key]: value }
            })),
        }),
        {
            name: 'home-storage-v2', // Versioned to clear old incompatible data
        }
    )
);
