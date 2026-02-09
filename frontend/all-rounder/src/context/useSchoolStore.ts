"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { School } from '@/app/_type/type';
import { Schools } from '@/app/_data/data';

interface SchoolState {
    schools: School[];
    activeSchool: School | null;
    isLoading: boolean;

    error: string | null;

    // Actions
    setSchools: (schools: School[]) => void;
    fetchSchools: () => Promise<void>;
    addSchool: (school: School) => Promise<void>;
    updateSchool: (id: string, updates: Partial<School>) => Promise<void>;
    deleteSchool: (id: string) => Promise<void>;
    setActiveSchool: (school: School | null) => void;
    getSchoolById: (id: string) => School | undefined;
}

export const useSchoolStore = create<SchoolState>()(
    persist(
        (set, get) => ({
            schools: Schools, // Initialize with static data
            activeSchool: null,
            isLoading: false,
            error: null,

            setSchools: (schools) => set({ schools }),

            fetchSchools: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/schools');
                    if (!response.ok) throw new Error('Failed to fetch schools');
                    const data = await response.json();
                    set({ schools: data });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            addSchool: async (school) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/schools', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(school)
                    });
                    if (!response.ok) throw new Error('Failed to add school');
                    const newSchool = await response.json();

                    set((state) => ({
                        schools: [...state.schools, newSchool]
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateSchool: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/schools/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates)
                    });
                    if (!response.ok) throw new Error('Failed to update school');
                    const updated = await response.json();

                    set((state) => ({
                        schools: state.schools.map(s =>
                            s.id === id ? { ...s, ...updated } : s
                        ),
                        activeSchool: state.activeSchool?.id === id
                            ? { ...state.activeSchool, ...updated }
                            : state.activeSchool
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteSchool: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/schools/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete school');

                    set((state) => ({
                        schools: state.schools.filter(s => s.id !== id),
                        activeSchool: state.activeSchool?.id === id ? null : state.activeSchool
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

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
