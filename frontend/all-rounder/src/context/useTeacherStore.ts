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
    updateTeacher: (id: string, updates: Partial<Teacher>) => Promise<void>;
    deleteTeacher: (id: string) => Promise<void>;
    getTeacherById: (id: string) => Teacher | undefined;
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

            updateTeacher: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/teachers/${id}`, updates);
                    const updated = response.data;

                    set((state) => ({
                        teachers: state.teachers.map(t =>
                            t.id === id ? { ...t, ...updated } : t
                        )
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update teacher' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteTeacher: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/teachers/${id}`);

                    set((state) => ({
                        teachers: state.teachers.filter(t => t.id !== id)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete teacher' });
                } finally {
                    set({ isLoading: false });
                }
            },

            getTeacherById: (id: string) => {
                return get().teachers.find(t => t.id === id);
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
