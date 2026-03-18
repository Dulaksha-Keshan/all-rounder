"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Teachers } from '@/app/_data/data';
import { Teacher } from '@/app/_type/type';
import api from '@/lib/axios';

// Define the shape of a Verification Request (from MongoDB)
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

const normalizeVerificationStatus = (status: unknown): VerificationRequest['verificationStatus'] => {
    const normalized = String(status || 'PENDING').toUpperCase();

    if (normalized === 'APPROVED' || normalized === 'ACCEPTED') {
        return 'APPROVED';
    }

    if (normalized === 'REJECTED' || normalized === 'DECLINED') {
        return 'REJECTED';
    }

    return 'PENDING';
};

const normalizeVerificationRequest = (request: any): VerificationRequest => ({
    id: request?.id || request?._id || '',
    userName: request?.userName || request?.requesterName || request?.user?.name || request?.student?.name || '',
    approverName: request?.approverName || request?.approvedByName || request?.approver?.name || request?.teacher?.name || '',
    verificationMethod: request?.verificationMethod || '',
    verificationStatus: normalizeVerificationStatus(request?.verificationStatus || request?.status),
    remarks: request?.remarks || '',
    createdAt: request?.createdAt || request?.updatedAt || new Date().toISOString(),
    updatedAt: request?.updatedAt || request?.verifiedAt || request?.createdAt,
});

const extractVerificationRequests = (payload: any): any[] => {
    const candidates = [
        payload?.pendingVerifications,
        payload?.requests,
        payload?.verifications,
        payload?.data,
        payload,
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate;
        }
    }

    return [];
};

const extractVerificationBuckets = (payload: any): {
    pending: any[];
    approved: any[];
    rejected: any[];
} => {
    const requests = payload?.requests || payload?.data?.requests;

    // New backend shape:
    // {
    //   requests: {
    //     pending: [...],
    //     approved: [...],
    //     rejected: [...]
    //   }
    // }
    if (requests && !Array.isArray(requests)) {
        const pending = Array.isArray(requests.pending) ? requests.pending : [];
        const approved = Array.isArray(requests.approved) ? requests.approved : [];
        const rejected = Array.isArray(requests.rejected) ? requests.rejected : [];
        return { pending, approved, rejected };
    }

    // Fallback for older payloads that return a single array.
    const rawRequests = extractVerificationRequests(payload);
    const normalizedRequests: VerificationRequest[] = Array.isArray(rawRequests)
        ? rawRequests.map(normalizeVerificationRequest)
        : [];

    return {
        pending: normalizedRequests.filter((r) => r.verificationStatus === 'PENDING'),
        approved: normalizedRequests.filter((r) => r.verificationStatus === 'APPROVED'),
        rejected: normalizedRequests.filter((r) => r.verificationStatus === 'REJECTED'),
    };
};

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
    updateVerificationStatus: (requestId: string, status: VerificationDecision, remarks: string) => Promise<void>;
    getAllVerificationRequests: () => Promise<void>;
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
                    const response = await api.get('/schools/teachers');
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
                    const response = await api.get(`/users/requests/pending`);

                    const payload = response.data || {};
                    const { pending } = extractVerificationBuckets(payload);
                    const normalizedPending: VerificationRequest[] = pending.map(normalizeVerificationRequest);
                    // const approved = normalizedRequests.filter((r) => r.verificationStatus === 'APPROVED');
                    // const rejected = normalizedRequests.filter((r) => r.verificationStatus === 'REJECTED');

                    set({
                        pendingRequests: normalizedPending,
                        // approvedRequests: approved,
                        // rejectedRequests: rejected
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
                    const response = await api.get(`/users/requests/all-requests`);

                    const payload = response.data || {};
                    const { pending, approved, rejected } = extractVerificationBuckets(payload);

                    const normalizedPending: VerificationRequest[] = pending.map(normalizeVerificationRequest);
                    const normalizedApproved: VerificationRequest[] = approved.map(normalizeVerificationRequest);
                    const normalizedRejected: VerificationRequest[] = rejected.map(normalizeVerificationRequest);

                    set({
                        pendingRequests: normalizedPending,
                        approvedRequests: normalizedApproved,
                        rejectedRequests: normalizedRejected
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch verification requests' });
                } finally {
                    set({ isLoading: false });
                }
            }, // Optional: Implement if you want to fetch all requests regardless of status

            updateVerificationStatus: async (requestId: string, status: VerificationDecision, remarks: string) => {
                set({ isLoading: true, error: null });
                try {
                    const payload = { remarks };
                    let response;
                    if (status === 'APPROVED') {
                        response = await api.patch(`/users/requests/${requestId}/accept`, payload);
                    } else {
                        response = await api.patch(`/users/requests/${requestId}/reject`, payload);
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