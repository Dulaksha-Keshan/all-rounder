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
    createPost: (content: string, media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[]) => void;
    saveDraft: (content: string, media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[]) => void;
    deletePost: (id: number) => void;
    deleteDraft: (id: number) => void;
    likePost: (id: number) => void;
    commentPost: (id: number, text: string) => void;
    updateStats: (key: keyof HomeState['stats'], value: number) => void;
}

export const useHomeStore = create<HomeState>()(
    persist(
        (set) => ({
            posts: INITIAL_POSTS,
            drafts: [],
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
                    likes: [],
                    comments: [],
                    media
                };
                return {
                    posts: [newPost, ...state.posts],
                    stats: { ...state.stats, contributions: state.stats.contributions + 1 }
                };
            }),
            saveDraft: (content, media) => set((state) => {
                const newDraft: PostType = {
                    id: Date.now(),
                    author: {
                        name: "You (Draft)",
                        role: "Student",
                    },
                    time: "Draft",
                    content,
                    likes: [],
                    comments: [],
                    media
                };
                return {
                    drafts: [newDraft, ...state.drafts]
                };
            }),
            deletePost: (id) => set((state) => ({
                posts: state.posts.filter(p => p.id !== id)
            })),
            deleteDraft: (id) => set((state) => ({
                drafts: state.drafts.filter(d => d.id !== id)
            })),
            likePost: (id) => set((state) => ({
                posts: state.posts.map(p => {
                    if (p.id === id) {
                        const isLiked = p.isLiked;
                        // Defensive check: ensure likes is an array (handles migration edge cases)
                        let newLikes = Array.isArray(p.likes) ? [...p.likes] : [];

                        if (isLiked) {
                            // Remove like (simulated user ID 1)
                            newLikes = newLikes.filter(l => l.userId !== 1);
                        } else {
                            // Add like
                            newLikes.push({ userId: 1, name: "You" });
                        }

                        return {
                            ...p,
                            likes: newLikes,
                            isLiked: !isLiked
                        };
                    }
                    return p;
                })
            })),
            commentPost: (id, text) => set((state) => ({
                posts: state.posts.map(p => {
                    if (p.id === id) {
                        const newComment: Comment = {
                            id: Date.now(),
                            author: { name: "You", role: "Student" },
                            text: text,
                            timestamp: "Just now"
                        };
                        return { ...p, comments: [...(Array.isArray(p.comments) ? p.comments : []), newComment] };
                    }
                    return p;
                })
            })),
            updateStats: (key, value) => set((state) => ({
                stats: { ...state.stats, [key]: value }
            })),
        }),
        {
            name: 'home-storage-v2', // Versioned to clear old incompatible data
        }
    )
);
