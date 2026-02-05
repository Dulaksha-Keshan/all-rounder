"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

    // Actions
    addSkillToUser: (skill: Skill) => void;
    removeSkillFromUser: (skillId: number) => void;
    createNewSkill: (skill: Omit<Skill, 'id' | 'endorsements'>) => void; // Admin/System action
    endorseSkill: (skillId: number) => void;
    setSearchQuery: (query: string) => void;
}

export const useSkillStore = create<SkillState>()(
    persist(
        (set) => ({
            skills: [
                { id: 1, name: "React", category: "Development", level: "Intermediate", endorsements: 5 },
                { id: 2, name: "Public Speaking", category: "Soft Skills", level: "Advanced", endorsements: 12 },
                { id: 3, name: "Photography", category: "Arts", level: "Beginner", endorsements: 2 },
            ],
            userSkills: [],
            searchQuery: "",

            addSkillToUser: (skill) => set((state) => {
                if (!state.userSkills.find(s => s.id === skill.id)) {
                    return { userSkills: [...state.userSkills, skill] };
                }
                return state;
            }),

            removeSkillFromUser: (skillId) => set((state) => ({
                userSkills: state.userSkills.filter(s => s.id !== skillId)
            })),

            createNewSkill: (skillData) => set((state) => ({
                skills: [...state.skills, { ...skillData, id: Date.now(), endorsements: 0 }]
            })),

            endorseSkill: (skillId) => set((state) => ({
                userSkills: state.userSkills.map(s =>
                    s.id === skillId ? { ...s, endorsements: s.endorsements + 1 } : s
                )
            })),

            setSearchQuery: (query) => set({ searchQuery: query }),
        }),
        {
            name: 'skill-storage',
        }
    )
);
