"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
                    const response = await fetch('/api/posts');
                    if (!response.ok) throw new Error('Failed to fetch posts');
                    const data = await response.json();
                    set({ posts: data });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            setPosts: (posts) => set({ posts }),

            createPost: async (postData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(postData)
                    });
                    if (!response.ok) throw new Error('Failed to create post');
                    const newPost = await response.json();

                    set((state) => ({ posts: [newPost, ...state.posts] }));
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
                    const response = await fetch(`/api/posts/${id}/like`, { method: 'POST' });
                    if (!response.ok) throw new Error('Failed to like post');
                } catch (error) {
                    set({ error: (error as Error).message });
                    // Could revert optimistic update
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
                    if (!response.ok) throw new Error('Failed to comment post');
                    // Assuming backend returns updated comment count or the comment itself

                    set((state) => ({
                        posts: state.posts.map(p => {
                            if (p.id === id) {
                                return { ...p, comments: p.comments + 1 };
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
        }),
        {
            name: 'post-storage',
        }
    )
);
