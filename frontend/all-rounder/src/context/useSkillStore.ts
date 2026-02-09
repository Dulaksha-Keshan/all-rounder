"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Skills } from '@/app/_data/skills';
import api from '@/lib/axios';

export interface Skill {
    id: number;
    name: string;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    endorsements: number;
}

interface SkillState {
    skills: Skill[]; // All available skills in the system
    userSkills: Skill[]; // Current user's skills
    searchQuery: string;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSkills: () => Promise<void>;
    fetchUserSkills: () => Promise<void>;
    addSkillToUser: (skill: Skill) => Promise<void>;
    removeSkillFromUser: (skillId: number) => Promise<void>;
    createNewSkill: (skill: Omit<Skill, 'id' | 'endorsements'>) => Promise<void>; // Admin/System action
    endorseSkill: (skillId: number) => Promise<void>;
    setSearchQuery: (query: string) => void;
}

export const useSkillStore = create<SkillState>()(
    persist(
        (set) => ({
            skills: Skills, // Import from data file instead of hardcoding
            userSkills: [],
            searchQuery: "",
            isLoading: false,
            error: null,

            fetchSkills: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/skills');
                    set({ skills: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch skills' });
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchUserSkills: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/user/skills');
                    set({ userSkills: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch user skills' });
                } finally {
                    set({ isLoading: false });
                }
            },

            addSkillToUser: async (skill) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post('/user/skills', { skillId: skill.id });

                    set((state) => {
                        if (!state.userSkills.find(s => s.id === skill.id)) {
                            return { userSkills: [...state.userSkills, skill] };
                        }
                        return state;
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to add skill' });
                } finally {
                    set({ isLoading: false });
                }
            },

            removeSkillFromUser: async (skillId) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/user/skills/${skillId}`);

                    set((state) => ({
                        userSkills: state.userSkills.filter(s => s.id !== skillId)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to remove skill' });
                } finally {
                    set({ isLoading: false });
                }
            },

            createNewSkill: async (skillData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/skills', skillData);
                    const newSkill = response.data;

                    set((state) => ({
                        skills: [...state.skills, newSkill]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create skill' });
                } finally {
                    set({ isLoading: false });
                }
            },

            endorseSkill: async (skillId) => {
                // Optimistic
                set((state) => ({
                    userSkills: state.userSkills.map(s =>
                        s.id === skillId ? { ...s, endorsements: s.endorsements + 1 } : s
                    )
                }));

                try {
                    await api.post(`/skills/${skillId}/endorse`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to endorse skill' });
                }
            },

            setSearchQuery: (query) => set({ searchQuery: query }),
        }),
        {
            name: 'skill-storage',
        }
    )
);
