"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PostType } from '../app/home/_components/PostCard';
import { INITIAL_POSTS } from '../app/home/constants';

interface HomeState {
    posts: PostType[];
    stats: {
        views: number;
        achievements: number;
        events: number;
        contributions: number;
    };
    createPost: (content: string, media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[]) => void;
    deletePost: (id: number) => void;
    likePost: (id: number) => void;
    commentPost: (id: number, text: string) => void;
    updateStats: (key: keyof HomeState['stats'], value: number) => void;
}

export const useHomeStore = create<HomeState>()(
    persist(
        (set) => ({
            posts: INITIAL_POSTS, // This might cause circular dependency if we import INITIAL_POSTS from HomeClient. 
            // Better to copy INITIAL_POSTS here or move it to a separate constants file. 
            // For now, I will duplicate the initial posts to avoid circular dependency issues which are common in Next.js
            stats: {
                views: 1234,
                achievements: 24,
                events: 8,
                contributions: 12
            },
            createPost: (content, media) => set((state) => {
                const newPost: PostType = {
                    id: Date.now(),
                    author: {
                        name: "You",
                        role: "Student",
                        image: undefined
                    },
                    time: "Just now",
                    content,
                    likes: 0,
                    comments: 0,
                    media
                };
                // Update stats: contribution + 1
                return {
                    posts: [newPost, ...state.posts],
                    stats: { ...state.stats, contributions: state.stats.contributions + 1 }
                };
            }),
            deletePost: (id) => set((state) => ({
                posts: state.posts.filter(p => p.id !== id)
            })),
            likePost: (id) => set((state) => ({
                posts: state.posts.map(p => {
                    if (p.id === id) {
                        return {
                            ...p,
                            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                            isLiked: !p.isLiked
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
            updateStats: (key, value) => set((state) => ({
                stats: { ...state.stats, [key]: value }
            })),
        }),
        {
            name: 'home-storage', // name of the item in the storage (must be unique)
        }
    )
);
