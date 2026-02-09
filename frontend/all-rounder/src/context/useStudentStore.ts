"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Students } from '@/app/_data/data';
import { Student } from '@/app/_type/type';

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
                    const response = await fetch('/api/students');
                    if (!response.ok) throw new Error('Failed to fetch students');
                    const data = await response.json();
                    set({ students: data });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            addStudent: async (student) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/students', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(student)
                    });
                    if (!response.ok) throw new Error('Failed to add student');
                    const newStudent = await response.json();

                    set((state) => ({
                        students: [...state.students, newStudent]
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateStudent: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/students/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates)
                    });
                    if (!response.ok) throw new Error('Failed to update student');
                    const updated = await response.json();

                    set((state) => ({
                        students: state.students.map(s =>
                            s.id === id ? { ...s, ...updated } : s
                        )
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteStudent: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete student');

                    set((state) => ({
                        students: state.students.filter(s => s.id !== id)
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
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
