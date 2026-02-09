"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Students } from '@/app/_data/data';
import { Student } from '@/app/_type/type';

interface StudentState {
    students: Student[];
    getStudentById: (id: number) => Student | undefined;
    searchStudents: (query: string) => Student[];
}

export const useStudentStore = create<StudentState>()(
    persist(
        (set, get) => ({
            students: Students,

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
