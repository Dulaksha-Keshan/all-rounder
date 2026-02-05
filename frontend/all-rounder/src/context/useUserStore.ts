"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Teacher, Organization } from '@/app/_type/type';

type UserRole = 'Student' | 'Teacher' | 'Organization' | 'Admin';

interface UserState {
    currentUser: Student | Teacher | Organization | null;
    userRole: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Social State
    following: number[]; // IDs of users I follow
    followers: number[]; // IDs of users following me
    followRequests: number[]; // IDs of users requesting to follow me
    sentRequests: number[]; // IDs of users I've requested to follow

    // Actions
    login: (user: Student | Teacher | Organization, role: UserRole) => void;
    logout: () => void;
    updateProfile: (updates: Partial<Student | Teacher | Organization>) => void;
    setError: (error: string | null) => void;

    // Social Actions
    followUser: (userId: number) => void;
    unfollowUser: (userId: number) => void;
    sendFollowRequest: (userId: number) => void;
    cancelFollowRequest: (userId: number) => void;
    acceptFollowRequest: (userId: number) => void;
    declineFollowRequest: (userId: number) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            currentUser: null,
            userRole: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Initial Social State
            following: [],
            followers: [],
            followRequests: [], // For demo, could populate with [2, 3] to show pending requests
            sentRequests: [],

            login: (user, role) => set({
                currentUser: user,
                userRole: role,
                isAuthenticated: true,
                error: null
            }),

            logout: () => set({
                currentUser: null,
                userRole: null,
                isAuthenticated: false,
                error: null,
                following: [],
                followers: [],
                followRequests: [],
                sentRequests: []
            }),

            updateProfile: (updates) => set((state) => ({
                currentUser: state.currentUser ? { ...state.currentUser, ...updates } as Student | Teacher | Organization : null
            })),

            setError: (error) => set({ error }),

            // Social Actions Implementation
            followUser: (userId) => set((state) => ({
                following: [...state.following, userId]
            })),

            unfollowUser: (userId) => set((state) => ({
                following: state.following.filter(id => id !== userId)
            })),

            sendFollowRequest: (userId) => set((state) => ({
                sentRequests: [...state.sentRequests, userId]
            })),

            cancelFollowRequest: (userId) => set((state) => ({
                sentRequests: state.sentRequests.filter(id => id !== userId)
            })),

            acceptFollowRequest: (userId) => set((state) => ({
                followers: [...state.followers, userId],
                followRequests: state.followRequests.filter(id => id !== userId)
            })),

            declineFollowRequest: (userId) => set((state) => ({
                followRequests: state.followRequests.filter(id => id !== userId)
            })),
        }),
        {
            name: 'user-storage',
        }
    )
);
