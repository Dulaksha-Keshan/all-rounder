"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { School } from '@/app/_type/type';
import { Schools } from '@/app/_data/data';

interface SchoolState {
    schools: School[];
    activeSchool: School | null;
    isLoading: boolean;

    // Actions
    setSchools: (schools: School[]) => void;
    addSchool: (school: School) => void;
    updateSchool: (id: string, updates: Partial<School>) => void;
    deleteSchool: (id: string) => void;
    setActiveSchool: (school: School | null) => void;
    getSchoolById: (id: string) => School | undefined;
}

export const useSchoolStore = create<SchoolState>()(
    persist(
        (set, get) => ({
            schools: Schools, // Initialize with static data
            activeSchool: null,
            isLoading: false,

            setSchools: (schools) => set({ schools }),

            addSchool: (school) => set((state) => ({
                schools: [...state.schools, school]
            })),

            updateSchool: (id, updates) => set((state) => ({
                schools: state.schools.map(s =>
                    s.id === id ? { ...s, ...updates } : s
                ),
                activeSchool: state.activeSchool?.id === id
                    ? { ...state.activeSchool, ...updates }
                    : state.activeSchool
            })),

            deleteSchool: (id) => set((state) => ({
                schools: state.schools.filter(s => s.id !== id),
                activeSchool: state.activeSchool?.id === id ? null : state.activeSchool
            })),

            setActiveSchool: (school) => set({ activeSchool: school }),

            getSchoolById: (id: string) => {
                return get().schools.find(s => s.id === id);
            },
        }),
        {
            name: 'school-storage',
        }
    )
);
