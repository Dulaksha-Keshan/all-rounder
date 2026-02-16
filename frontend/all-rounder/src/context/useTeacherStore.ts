"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Teachers } from '@/app/_data/data';
import { Teacher } from '@/app/_type/type';
import api from '@/lib/axios';

interface TeacherState {
    teachers: Teacher[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTeachers: () => Promise<void>;
    addTeacher: (teacher: Teacher) => Promise<void>;
    updateTeacher: (uid: string, updates: Partial<Teacher>) => Promise<void>;
    deleteTeacher: (uid: string) => Promise<void>;
    getTeacherById: (uid: string) => Teacher | undefined;
    searchTeachers: (query: string) => Teacher[];
}

export const useTeacherStore = create<TeacherState>()(
    persist(
        (set, get) => ({
            teachers: Teachers,

            isLoading: false,
            error: null,

            fetchTeachers: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/teachers');
                    set({ teachers: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch teachers' });
                } finally {
                    set({ isLoading: false });
                }
            },

            addTeacher: async (teacher) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/teachers', teacher);
                    set((state) => ({
                        teachers: [...state.teachers, response.data]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to add teacher' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateTeacher: async (uid, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/teachers/${uid}`, updates);
                    const updated = response.data;

                    set((state) => ({
                        teachers: state.teachers.map(t =>
                            t.uid === uid ? { ...t, ...updated } : t
                        )
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update teacher' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteTeacher: async (uid) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/teachers/${uid}`);

                    set((state) => ({
                        teachers: state.teachers.filter(t => t.uid !== uid)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete teacher' });
                } finally {
                    set({ isLoading: false });
                }
            },

            getTeacherById: (uid: string) => {
                return get().teachers.find(t => t.uid === uid);
            },

            searchTeachers: (query: string) => {
                const lowerQuery = query.toLowerCase();
                return get().teachers.filter(teacher =>
                    teacher.name.toLowerCase().includes(lowerQuery)
                );
            },
        }),
        {
            name: 'teacher-storage',
        }
    )
);
