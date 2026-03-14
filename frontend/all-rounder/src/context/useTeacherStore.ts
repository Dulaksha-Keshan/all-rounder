"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Teachers } from '@/app/_data/data';
import { Teacher } from '@/app/_type/type';
import api from '@/lib/axios';

// Define the shape of a Verification Request (from MongoDB)
export interface VerificationRequest {
    id: string; // The MongoDB _id
    studentId: string;
    studentName: string;
    grade: string;
    teacherId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}

interface TeacherState {
    teachers: Teacher[];
    
    // NEW: Verification Request States
    pendingRequests: VerificationRequest[];
    approvedRequests: VerificationRequest[];
    rejectedRequests: VerificationRequest[];

    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTeachers: () => Promise<void>;
    addTeacher: (teacher: Teacher) => Promise<void>;
    updateTeacher: (uid: string, updates: Partial<Teacher>) => Promise<void>;
    deleteTeacher: (uid: string) => Promise<void>;
    getTeacherById: (uid: string) => Teacher | undefined;
    searchTeachers: (query: string) => Teacher[];

    // NEW: Verification Actions
    fetchVerificationRequests: (teacherId: string) => Promise<void>;
    updateVerificationStatus: (requestId: string, status: 'ACCEPTED' | 'REJECTED') => Promise<void>;
}

export const useTeacherStore = create<TeacherState>()(
    persist(
        (set, get) => ({
            teachers: Teachers,

            pendingRequests: [],
            approvedRequests: [],
            rejectedRequests: [],

            isLoading: false,
            error: null,

            fetchTeachers: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/teachers');
                    set({ teachers: response.data.teachers || response.data });
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

            // --- NEW: VERIFICATION ACTIONS ---

            fetchVerificationRequests: async (teacherId: string) => {
                set({ isLoading: true, error: null });
                try {
                    // Adjust this URL to match your Express routes!
                    const response = await api.get(`/teachers/${teacherId}/requests`);
                    
                    const requests = response.data.requests || [];
                    
                    // Filter them into buckets
                    const pending = requests.filter((r: VerificationRequest) => r.status === 'PENDING');
                    const approved = requests.filter((r: VerificationRequest) => r.status === 'ACCEPTED');
                    const rejected = requests.filter((r: VerificationRequest) => r.status === 'REJECTED');

                    set({ 
                        pendingRequests: pending,
                        approvedRequests: approved,
                        rejectedRequests: rejected
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch verification requests' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateVerificationStatus: async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
                set({ isLoading: true, error: null });
                try {
                    // Note: Your backend should handle updating the MongoDB document AND 
                    // pushing/pulling the ID from the Postgres Teacher array in one transaction.
                    const response = await api.put(`/verification-requests/${requestId}`, { status });
                    const updatedRequest = response.data.request;

                    // Optimistically update the UI arrays
                    set((state) => {
                        // Remove from pending
                        const remainingPending = state.pendingRequests.filter(r => r.id !== requestId);
                        
                        if (status === 'ACCEPTED') {
                            return {
                                pendingRequests: remainingPending,
                                approvedRequests: [updatedRequest, ...state.approvedRequests]
                            };
                        } else {
                            return {
                                pendingRequests: remainingPending,
                                rejectedRequests: [updatedRequest, ...state.rejectedRequests]
                            };
                        }
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || `Failed to ${status.toLowerCase()} request` });
                    throw error; // Rethrow to let the UI modal know it failed
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'teacher-storage',
            // DO NOT persist the requests, error, or loading states.
            // We want requests to fetch fresh from the DB every time the profile mounts.
            partialize: (state) => ({
                teachers: state.teachers
            }),
        }
    )
);