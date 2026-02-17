"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post } from '@/app/_type/type';
import api from '@/lib/axios';
import { useUserStore } from './useUserStore';

interface HomeState {
    posts: Post[];
    drafts: Post[];
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
    deletePost: (id: string) => Promise<void>;
    deleteDraft: (id: string) => Promise<void>;
    editPost: (id: string, newContent: string) => Promise<void>;
    likePost: (id: string) => Promise<void>;
    commentPost: (id: string, text: string) => Promise<void>;
    updateStats: (key: keyof HomeState['stats'], value: number) => void;
}

export const useHomeStore = create<HomeState>()(
    persist(
        (set, get) => ({
            posts: [],
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
                        posts: state.posts.filter(p => p._id !== id)
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
                        drafts: state.drafts.filter(d => d._id !== id)
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
                            p._id === id ? { ...p, ...updatedPost } : p
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
                        if (p._id === id) {
                            const currentUser = useUserStore.getState().currentUser;
                            const currentUserId = currentUser?.uid || "1";
                            const isLiked = p.likes.includes(currentUserId);
                            let newLikes = [...p.likes];

                            if (isLiked) {
                                newLikes = newLikes.filter(uid => uid !== currentUserId);
                            } else {
                                newLikes.push(currentUserId);
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
                }
            },

            commentPost: async (id, text) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post(`/posts/${id}/comments`, { text });
                    const newComment = response.data;

                    set((state) => ({
                        posts: state.posts.map(p => {
                            if (p._id === id) {
                                // Logic assumes p.comments exists and is array. 
                                return { ...p, comments: [...(p.comments || []), newComment] };
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
            name: 'home-storage-v2',
        }
    )
);
