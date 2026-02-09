"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Skills } from '@/app/_data/skills';

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
                    const response = await fetch('/api/skills');
                    if (!response.ok) throw new Error('Failed to fetch skills');
                    const data = await response.json();
                    set({ skills: data });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchUserSkills: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/user/skills');
                    if (!response.ok) throw new Error('Failed to fetch user skills');
                    const data = await response.json();
                    set({ userSkills: data });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            addSkillToUser: async (skill) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/user/skills', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ skillId: skill.id })
                    });
                    if (!response.ok) throw new Error('Failed to add skill');

                    set((state) => {
                        if (!state.userSkills.find(s => s.id === skill.id)) {
                            return { userSkills: [...state.userSkills, skill] };
                        }
                        return state;
                    });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            removeSkillFromUser: async (skillId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/user/skills/${skillId}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to remove skill');

                    set((state) => ({
                        userSkills: state.userSkills.filter(s => s.id !== skillId)
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            createNewSkill: async (skillData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/skills', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(skillData)
                    });
                    if (!response.ok) throw new Error('Failed to create skill');
                    const newSkill = await response.json();

                    set((state) => ({
                        skills: [...state.skills, newSkill]
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
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
                    const response = await fetch(`/api/skills/${skillId}/endorse`, { method: 'POST' });
                    if (!response.ok) throw new Error('Failed to endorse skill');
                } catch (error) {
                    set({ error: (error as Error).message });
                }
            },

            setSearchQuery: (query) => set({ searchQuery: query }),
        }),
        {
            name: 'skill-storage',
        }
    )
);
