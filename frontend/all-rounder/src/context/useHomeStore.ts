"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PostType, Comment } from '../app/home/_components/PostCard';
import { INITIAL_POSTS } from '../app/home/constants';

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
    createPost: (content: string, media?: { type: 'image' | 'video'; url: string; name: string }[]) => Promise<void>; // Corrected media type in implementation
    saveDraft: (content: string, media?: { type: 'image' | 'video'; url: string; name: string }[]) => Promise<void>;
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
                    const response = await fetch('/api/home');
                    if (!response.ok) throw new Error('Failed to fetch home data');
                    const data = await response.json();
                    set({
                        posts: data.posts || [],
                        stats: data.stats || get().stats
                    });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            createPost: async (content, media) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content, media })
                    });
                    if (!response.ok) throw new Error('Failed to create post');
                    const newPost = await response.json();

                    set((state) => ({
                        posts: [newPost, ...state.posts],
                        stats: { ...state.stats, contributions: state.stats.contributions + 1 }
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            saveDraft: async (content, media) => {
                set({ isLoading: true, error: null });
                try {
                    // Assuming drafts are also saved to backend
                    const response = await fetch('/api/drafts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content, media })
                    });
                    if (!response.ok) throw new Error('Failed to save draft');
                    const newDraft = await response.json();

                    set((state) => ({
                        drafts: [newDraft, ...state.drafts]
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            deletePost: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete post');

                    set((state) => ({
                        posts: state.posts.filter(p => p.id !== id)
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteDraft: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/drafts/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete draft');

                    set((state) => ({
                        drafts: state.drafts.filter(d => d.id !== id)
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            editPost: async (id, newContent) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/posts/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: newContent })
                    });
                    if (!response.ok) throw new Error('Failed to edit post');
                    const updatedPost = await response.json();

                    set((state) => ({
                        posts: state.posts.map(p =>
                            p.id === id ? { ...p, ...updatedPost } : p
                        )
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
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
                    const response = await fetch(`/api/posts/${id}/like`, { method: 'POST' });
                    if (!response.ok) {
                        throw new Error('Failed to toggle like');
                        // Revert if needed, but for now simple error logging
                    }
                } catch (error) {
                    set({ error: (error as Error).message });
                    // Could revert optimistic update here
                }
            },

            commentPost: async (id, text) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/posts/${id}/comments`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text })
                    });
                    if (!response.ok) throw new Error('Failed to post comment');
                    const newComment = await response.json();

                    set((state) => ({
                        posts: state.posts.map(p => {
                            if (p.id === id) {
                                return { ...p, comments: [...(Array.isArray(p.comments) ? p.comments : []), newComment] };
                            }
                            return p;
                        })
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
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
