"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { School } from '@/app/_type/type';
import { Schools } from '@/app/_data/data';
import api from '@/lib/axios';

interface SchoolState {
    schools: School[];
    activeSchool: School | null;
    isLoading: boolean;

    error: string | null;

    // Actions
    setSchools: (schools: School[]) => void;
    fetchSchools: () => Promise<void>;
    addSchool: (school: School) => Promise<void>;
    updateSchool: (school_id: string, updates: Partial<School>) => Promise<void>;
    deleteSchool: (school_id: string) => Promise<void>;
    setActiveSchool: (school: School | null) => void;
    getSchoolById: (school_id: string) => School | undefined;
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
                    const response = await api.get('/schools');
                    set({ schools: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch schools' });
                } finally {
                    set({ isLoading: false });
                }
            },

            addSchool: async (school) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/schools', school);
                    set((state) => ({
                        schools: [...state.schools, response.data]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to add school' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateSchool: async (school_id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/schools/${school_id}`, updates);
                    const updated = response.data;

                    set((state) => ({
                        schools: state.schools.map(s =>
                            s.school_id === school_id ? { ...s, ...updated } : s
                        ),
                        activeSchool: state.activeSchool?.school_id === school_id
                            ? { ...state.activeSchool, ...updated }
                            : state.activeSchool
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update school' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteSchool: async (school_id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/schools/${school_id}`);

                    set((state) => ({
                        schools: state.schools.filter(s => s.school_id !== school_id),
                        activeSchool: state.activeSchool?.school_id === school_id ? null : state.activeSchool
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete school' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setActiveSchool: (school) => set({ activeSchool: school }),

            getSchoolById: (school_id: string) => {
                return get().schools.find(s => s.school_id === school_id);
            },
        }),
        {
            name: 'school-storage',
        }
    )
);
