"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { School } from '@/app/_type/type';
import { Schools } from '@/app/_data/data'; // Legacy static data if needed
import api from '@/lib/axios';

// You can import real types for Teacher/Student if you have them in type.ts
interface SchoolState {
    schools: School[];
    activeSchool: School | null;
    
    // NEW: States for specific school data
    schoolTeachers: any[]; 
    schoolStudents: any[];
    schoolStatistics: any | null;

    isLoading: boolean;
    error: string | null;

    // Actions
    setSchools: (schools: School[]) => void;
    fetchSchools: () => Promise<void>;
    addSchool: (school: School) => Promise<void>;
    updateSchool: (school_id: string, updates: Partial<School>) => Promise<void>;
    deleteSchool: (school_id: string) => Promise<void>;
    setActiveSchool: (school: School | null) => void;
    getSchoolById: (school_id: string) => School | null;

    // NEW: Actions matching your controller endpoints
    fetchSchoolTeachers: (school_id: string) => Promise<void>;
    fetchSchoolStudents: (school_id: string) => Promise<void>;
    fetchSchoolStatistics: (school_id: string) => Promise<void>;
}

export const useSchoolStore = create<SchoolState>()(
    persist(
        (set, get) => ({
            schools: Schools, // Initialize with static data
            activeSchool: null,
            schoolTeachers: [],
            schoolStudents: [],
            schoolStatistics: null,
            isLoading: false,
            error: null,

            setSchools: (schools) => set({ schools }),

            fetchSchools: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/schools');
                    set({ schools: response.data.schools || [] });
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
                    const updated = response.data.school; // Matched to your controller response

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
                return get().schools.find(s => s.school_id === school_id) || null;
            },


            fetchSchoolTeachers: async (school_id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/schools/${school_id}/teachers`);
                    set({ schoolTeachers: response.data.teachers || [] });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch teachers' });
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchSchoolStudents: async (school_id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/schools/${school_id}/students`);
                    set({ schoolStudents: response.data.students || [] });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch students' });
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchSchoolStatistics: async (school_id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/schools/${school_id}/statistics`);
                    set({ schoolStatistics: response.data.statistics || null });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch statistics' });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'school-storage',
            partialize: (state) => ({
                schools: state.schools,
                activeSchool: state.activeSchool,
                // We typically don't persist teachers/students either, 
                // so they are freshly fetched when a user navigates to a school page
            }),
        }
    )
);