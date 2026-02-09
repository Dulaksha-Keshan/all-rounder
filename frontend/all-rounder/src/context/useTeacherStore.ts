"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Teachers } from '@/app/_data/data';
import { Teacher } from '@/app/_type/type';

interface TeacherState {
    teachers: Teacher[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTeachers: () => Promise<void>;
    addTeacher: (teacher: Teacher) => Promise<void>;
    updateTeacher: (id: number, updates: Partial<Teacher>) => Promise<void>;
    deleteTeacher: (id: number) => Promise<void>;
    getTeacherById: (id: number) => Teacher | undefined;
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
                    const response = await fetch('/api/teachers');
                    if (!response.ok) throw new Error('Failed to fetch teachers');
                    const data = await response.json();
                    set({ teachers: data });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            addTeacher: async (teacher) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/teachers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(teacher)
                    });
                    if (!response.ok) throw new Error('Failed to add teacher');
                    const newTeacher = await response.json();

                    set((state) => ({
                        teachers: [...state.teachers, newTeacher]
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateTeacher: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/teachers/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates)
                    });
                    if (!response.ok) throw new Error('Failed to update teacher');
                    const updated = await response.json();

                    set((state) => ({
                        teachers: state.teachers.map(t =>
                            t.id === id ? { ...t, ...updated } : t
                        )
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteTeacher: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete teacher');

                    set((state) => ({
                        teachers: state.teachers.filter(t => t.id !== id)
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            getTeacherById: (id: number) => {
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
