"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { Achievement } from '@/app/_type/type';

interface AchievementState {
    achievements: Achievement[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAchievements: (userId: string) => Promise<void>;
    createAchievement: (achievement: Omit<Achievement, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateAchievement: (id: string, achievement: Partial<Achievement>) => Promise<void>;
    deleteAchievement: (id: string) => Promise<void>;
}

export const useAchievementStore = create<AchievementState>()(
    persist(
        (set) => ({
            achievements: [],
            isLoading: false,
            error: null,

            fetchAchievements: async (userId) => {
                set({ isLoading: true, error: null });
                try {
                    // Adjust endpoint as needed, e.g., /users/:userId/achievements or /achievements?user=:userId
                    const response = await api.get(`/achievements/user/${userId}`);
                    set({ achievements: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch achievements' });
                } finally {
                    set({ isLoading: false });
                }
            },

            createAchievement: async (achievementData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/achievements', achievementData);
                    set((state) => ({
                        achievements: [response.data, ...state.achievements]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create achievement' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateAchievement: async (id, achievementData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/achievements/${id}`, achievementData);
                    set((state) => ({
                        achievements: state.achievements.map((a) =>
                            a._id === id ? response.data : a
                        )
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update achievement' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteAchievement: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/achievements/${id}`);
                    set((state) => ({
                        achievements: state.achievements.filter((a) => a._id !== id)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete achievement' });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'achievement-storage',
        }
    )
);
