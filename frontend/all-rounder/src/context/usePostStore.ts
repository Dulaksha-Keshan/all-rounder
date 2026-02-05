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

    // Actions
    createPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'time'>) => void;
    deletePost: (id: number) => void;
    likePost: (id: number) => void;
    commentPost: (id: number, text: string) => void;
    setPosts: (posts: Post[]) => void;
}

export const usePostStore = create<PostState>()(
    persist(
        (set) => ({
            posts: [],
            isLoading: false,

            setPosts: (posts) => set({ posts }),

            createPost: (postData) => set((state) => {
                const newPost: Post = {
                    ...postData,
                    id: Date.now(),
                    time: "Just now",
                    likes: 0,
                    comments: 0
                };
                return { posts: [newPost, ...state.posts] };
            }),

            deletePost: (id) => set((state) => ({
                posts: state.posts.filter(p => p.id !== id)
            })),

            likePost: (id) => set((state) => ({
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
            })),

            commentPost: (id, text) => set((state) => ({
                posts: state.posts.map(p => {
                    if (p.id === id) {
                        return { ...p, comments: p.comments + 1 };
                    }
                    return p;
                })
            })),
        }),
        {
            name: 'post-storage',
        }
    )
);
