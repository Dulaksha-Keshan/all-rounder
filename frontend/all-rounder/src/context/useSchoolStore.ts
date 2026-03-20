"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { School } from '@/app/_type/type';
import { Schools } from '@/app/_data/data'; // Legacy static data if needed
import api from '@/lib/axios';

export interface VerificationRequest {
    id: string;
    userName?: string;
    approverName?: string;
    verificationMethod: string;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    remarks?: string;
    createdAt: string;
    updatedAt?: string;
}

type VerificationDecision = 'APPROVED' | 'REJECTED';

const normalizeVerificationRequest = (request: any): VerificationRequest => ({
    id: request.id || request._id,
    userName: request?.userName || request?.requesterName || request?.user?.name || request?.teacherName || request?.teacher?.name || '',
    approverName: request?.approverName || request?.approvedByName || request?.approver?.name || '',
    verificationMethod: request.verificationMethod || '',
    verificationStatus: request.verificationStatus || request.status || 'PENDING',
    remarks: request.remarks || '',
    createdAt: request.createdAt,
    updatedAt: request.verifiedAt || request.createdAt,
});

// You can import real types for Teacher/Student if you have them in type.ts
interface SchoolState {
    schools: School[];
    activeSchool: School | null;
    
    // NEW: States for specific school data
    schoolTeachers: any[]; 
    schoolStudents: any[];
    schoolStatistics: any | null;
    schoolStatisticsBySchoolId: Record<string, any>;
    schoolStudentBreakdownBySchoolId: Record<string, { male: number; female: number; total: number }>;

    // Verification request states (for school admins approving teachers)
    pendingRequests: VerificationRequest[];
    approvedRequests: VerificationRequest[];
    rejectedRequests: VerificationRequest[];

    isLoading: boolean;
    error: string | null;

    // Actions
    setSchools: (schools: School[]) => void;
    fetchSchools: () => Promise<void>;
    fetchSchoolById: (school_id: string) => Promise<School | null>;
    addSchool: (school: School) => Promise<void>;
    updateSchool: (school_id: string, updates: Partial<School>) => Promise<void>;
    deleteSchool: (school_id: string) => Promise<void>;
    setActiveSchool: (school: School | null) => void;
    getSchoolById: (school_id: string) => School | null;

    // NEW: Actions matching your controller endpoints
    fetchSchoolTeachers: (school_id: string) => Promise<void>;
    fetchSchoolStudents: (school_id: string) => Promise<void>;
    fetchSchoolStatistics: (school_id: string) => Promise<void>;

    // Verification actions
    fetchVerificationRequests: (school_id: string) => Promise<void>;
    getAllVerificationRequests: () => Promise<void>;
    updateVerificationStatus: (requestId: string, status: VerificationDecision) => Promise<void>;
}

export const useSchoolStore = create<SchoolState>()(
    persist(
        (set, get) => ({
            schools: Schools, // Initialize with static data
            activeSchool: null,
            schoolTeachers: [],
            schoolStudents: [],
            schoolStatistics: null,
            schoolStatisticsBySchoolId: {},
            schoolStudentBreakdownBySchoolId: {},
            pendingRequests: [],
            approvedRequests: [],
            rejectedRequests: [],
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

            fetchSchoolById: async (school_id: string) => {
                if (!school_id) return null;

                const existing = get().schools.find((s: any) => {
                    const candidateId = String(s.school_id || s.id || s._id || '');
                    return candidateId === String(school_id);
                });

                if (existing) return existing;

                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/schools/${school_id}`);
                    const fetchedSchool = response.data?.school || response.data?.data || response.data || null;

                    if (!fetchedSchool) return null;

                    set((state) => ({
                        schools: [...state.schools.filter((s: any) => {
                            const candidateId = String(s.school_id || s.id || s._id || '');
                            return candidateId !== String(fetchedSchool.school_id || fetchedSchool.id || fetchedSchool._id || '');
                        }), fetchedSchool]
                    }));

                    return fetchedSchool;
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch school' });
                    return null;
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
                return get().schools.find((s: any) => {
                    const candidateId = String(s.school_id || s.id || s._id || '');
                    return candidateId === String(school_id);
                }) || null;
            },


            fetchSchoolTeachers: async (school_id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/schools/${school_id}/teachers`);
                    // Extract teachers array from response - backend returns { teachers: [...] }
                    const teachers = response.data?.teachers || response.data?.data || [];
                    set({ schoolTeachers: teachers });
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
                    // Extract students array from response - backend returns { students: [...] }
                    const students = response.data?.students || response.data?.data || [];

                    const normalizedSchoolGender = String(
                        get().getSchoolById(school_id)?.gender || get().activeSchool?.gender || ''
                    ).toLowerCase();

                    let male = 0;
                    let female = 0;

                    if (normalizedSchoolGender === 'boys') {
                        male = students.length;
                        female = 0;
                    } else if (normalizedSchoolGender === 'girls') {
                        male = 0;
                        female = students.length;
                    } else {
                        students.forEach((student: any) => {
                            const sex = String(student?.sex || student?.gender || '').toUpperCase();
                            if (sex === 'MALE' || sex === 'M') {
                                male += 1;
                            } else if (sex === 'FEMALE' || sex === 'F') {
                                female += 1;
                            }
                        });
                    }

                    set((state) => ({
                        schoolStudents: students,
                        schoolStudentBreakdownBySchoolId: {
                            ...state.schoolStudentBreakdownBySchoolId,
                            [school_id]: {
                                male,
                                female,
                                total: students.length,
                            },
                        },
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch students' });
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchSchoolStatistics: async (school_id) => {
                if (!school_id) return;
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/schools/${school_id}/statistics`);
                    const statistics = response.data.statistics || null;
                    set((state) => ({
                        schoolStatistics: statistics,
                        schoolStatisticsBySchoolId: {
                            ...state.schoolStatisticsBySchoolId,
                            [school_id]: statistics,
                        },
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch statistics' });
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchVerificationRequests: async (school_id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/users/requests/pending/${get().activeSchool?.school_id}`);

                    const payload = response.data || {};
                    const rawRequests = payload.pendingVerifications || [];

                    const normalizedRequests: VerificationRequest[] = Array.isArray(rawRequests)
                        ? rawRequests.map(normalizeVerificationRequest)
                        : [];

                    const pending = normalizedRequests.filter((r) => r.verificationStatus === 'PENDING');

                    set({
                        pendingRequests: pending,
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch verification requests' });
                } finally {
                    set({ isLoading: false });
                }
            },

            getAllVerificationRequests: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/users/requests/all-requests/${get().activeSchool?.school_id}`);

                    const payload = response.data || {};
                    const rawRequests = payload.pendingVerifications || [];

                    const normalizedRequests: VerificationRequest[] = Array.isArray(rawRequests)
                        ? rawRequests.map(normalizeVerificationRequest)
                        : [];

                    const pending = normalizedRequests.filter((r) => r.verificationStatus === 'PENDING');
                    const approved = normalizedRequests.filter((r) => r.verificationStatus === 'APPROVED');
                    const rejected = normalizedRequests.filter((r) => r.verificationStatus === 'REJECTED');

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

            updateVerificationStatus: async (requestId: string, status: VerificationDecision) => {
                set({ isLoading: true, error: null });
                try {
                    let response;
                    if (status === 'APPROVED') {
                        response = await api.patch(`/users/requests/${requestId}/accept/${get().activeSchool?.school_id}`);
                    } else {
                        response = await api.patch(`/users/requests/${requestId}/reject/${get().activeSchool?.school_id}`);
                    }

                    const updatedRequest = normalizeVerificationRequest(
                        response.data.verification
                    );

                    set((state) => {
                        const remainingPending = state.pendingRequests.filter(r => r.id !== requestId);
                        const remainingApproved = state.approvedRequests.filter(r => r.id !== requestId);
                        const remainingRejected = state.rejectedRequests.filter(r => r.id !== requestId);

                        if (updatedRequest.verificationStatus === 'APPROVED') {
                            return {
                                pendingRequests: remainingPending,
                                approvedRequests: [updatedRequest, ...remainingApproved],
                                rejectedRequests: remainingRejected,
                            };
                        } else {
                            return {
                                pendingRequests: remainingPending,
                                approvedRequests: remainingApproved,
                                rejectedRequests: [updatedRequest, ...remainingRejected],
                            };
                        }
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || `Failed to ${status.toLowerCase()} request` });
                    throw error;
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
                // We don't persist teachers/students/verification requests so they stay fresh.
            }),
        }
    )
);