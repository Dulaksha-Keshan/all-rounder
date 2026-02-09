"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Students } from '@/app/_data/data';
import { Student } from '@/app/_type/type';
import api from '@/lib/axios';

interface StudentState {
    students: Student[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchStudents: () => Promise<void>;
    addStudent: (student: Student) => Promise<void>;
    updateStudent: (id: number, updates: Partial<Student>) => Promise<void>;
    deleteStudent: (id: number) => Promise<void>;
    getStudentById: (id: number) => Student | undefined;
    searchStudents: (query: string) => Student[];
}

export const useStudentStore = create<StudentState>()(
    persist(
        (set, get) => ({
            students: Students,

            isLoading: false,
            error: null,

            fetchStudents: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/students');
                    set({ students: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch students' });
                } finally {
                    set({ isLoading: false });
                }
            },

            addStudent: async (student) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/students', student);
                    set((state) => ({
                        students: [...state.students, response.data]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to add student' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateStudent: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/students/${id}`, updates);
                    const updated = response.data;

                    set((state) => ({
                        students: state.students.map(s =>
                            s.id === id ? { ...s, ...updated } : s
                        )
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update student' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteStudent: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/students/${id}`);

                    set((state) => ({
                        students: state.students.filter(s => s.id !== id)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete student' });
                } finally {
                    set({ isLoading: false });
                }
            },

            getStudentById: (id: number) => {
                return get().students.find(s => s.id === id);
            },

            searchStudents: (query: string) => {
                const lowerQuery = query.toLowerCase();
                return get().students.filter(student =>
                    student.name.toLowerCase().includes(lowerQuery)
                );
            },
        }),
        {
            name: 'student-storage',
        }
    )
);
