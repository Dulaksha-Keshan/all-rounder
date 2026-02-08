"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Teachers } from '@/app/_data/data';
import { Teacher } from '@/app/_type/type';

interface TeacherState {
    teachers: Teacher[];
    getTeacherById: (id: number) => Teacher | undefined;
    searchTeachers: (query: string) => Teacher[];
}

export const useTeacherStore = create<TeacherState>()(
    persist(
        (set, get) => ({
            teachers: Teachers,

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
