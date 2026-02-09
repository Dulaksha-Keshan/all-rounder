"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, Teacher, Organization } from '@/app/_type/type';
import api from '@/lib/axios';

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
    login: (user: Student | Teacher | Organization, role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<Student | Teacher | Organization>) => Promise<void>;
    setError: (error: string | null) => void;

    // Social Actions
    followUser: (userId: number) => Promise<void>;
    unfollowUser: (userId: number) => Promise<void>;
    sendFollowRequest: (userId: number) => Promise<void>;
    cancelFollowRequest: (userId: number) => Promise<void>;
    acceptFollowRequest: (userId: number) => Promise<void>;
    declineFollowRequest: (userId: number) => Promise<void>;
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

            login: async (user, role) => {
                set({ isLoading: true, error: null });
                try {
                    // Simulating API login
                    // const response = await fetch('/api/auth/login', { ... });
                    // const data = await response.json();

                    // For now, keeping the mock behavior but wrapping in async
                    await new Promise(resolve => setTimeout(resolve, 500));

                    set({
                        currentUser: user,
                        userRole: role,
                        isAuthenticated: true,
                        error: null
                    });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    // await fetch('/api/auth/logout', { method: 'POST' });
                    set({
                        currentUser: null,
                        userRole: null,
                        isAuthenticated: false,
                        error: null,
                        following: [],
                        followers: [],
                        followRequests: [],
                        sentRequests: []
                    });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateProfile: async (updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put('/user/profile', updates);
                    const updatedUser = response.data;

                    set((state) => ({
                        currentUser: state.currentUser ? { ...state.currentUser, ...updatedUser } : null
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update profile' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setError: (error) => set({ error }),

            // Social Actions Implementation
            followUser: async (userId) => {
                // Optimistic
                set((state) => ({
                    following: [...state.following, userId]
                }));
                try {
                    await api.post(`/user/follow/${userId}`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to follow user' });
                    // Revert optimistic update
                    set((state) => ({
                        following: state.following.filter(id => id !== userId)
                    }));
                }
            },

            unfollowUser: async (userId) => {
                // Optimistic
                set((state) => ({
                    following: state.following.filter(id => id !== userId)
                }));
                try {
                    await api.delete(`/user/follow/${userId}`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to unfollow user' });
                    // Revert
                    set((state) => ({
                        following: [...state.following, userId]
                    }));
                }
            },

            sendFollowRequest: async (userId) => {
                set((state) => ({
                    sentRequests: [...state.sentRequests, userId]
                }));
                try {
                    await api.post(`/user/follow-request/${userId}`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to send follow request' });
                    set((state) => ({
                        sentRequests: state.sentRequests.filter(id => id !== userId)
                    }));
                }
            },

            cancelFollowRequest: async (userId) => {
                set((state) => ({
                    sentRequests: state.sentRequests.filter(id => id !== userId)
                }));
                try {
                    await api.delete(`/user/follow-request/${userId}`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to cancel follow request' });
                    set((state) => ({
                        sentRequests: [...state.sentRequests, userId]
                    }));
                }
            },

            acceptFollowRequest: async (userId) => {
                set((state) => ({
                    followers: [...state.followers, userId],
                    followRequests: state.followRequests.filter(id => id !== userId)
                }));
                try {
                    await api.post(`/user/follow-request/${userId}/accept`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to accept follow request' });
                    // Revert logic needed here if robust
                }
            },

            declineFollowRequest: async (userId) => {
                set((state) => ({
                    followRequests: state.followRequests.filter(id => id !== userId)
                }));
                try {
                    await api.post(`/user/follow-request/${userId}/decline`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to decline follow request' });
                }
            },
        }),
        {
            name: 'user-storage',
        }
    )
);
