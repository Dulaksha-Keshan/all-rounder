"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { Verification } from '@/app/_type/type';

interface VerificationState {
    verifications: Verification[];
    myVerification: Verification | null; // For the current user
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchVerifications: () => Promise<void>; // For admin
    fetchMyVerification: (userId: string) => Promise<void>;
    requestVerification: (data: Omit<Verification, '_id' | 'createdAt' | 'updatedAt' | 'verificationStatus' | 'verifiedAt'>) => Promise<void>;
    updateVerificationStatus: (id: string, status: Verification['verificationStatus'], remarks?: string) => Promise<void>;
}

export const useVerificationStore = create<VerificationState>()(
    persist(
        (set) => ({
            verifications: [],
            myVerification: null,
            isLoading: false,
            error: null,

            fetchVerifications: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/verifications');
                    set({ verifications: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch verifications' });
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchMyVerification: async (userId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/verifications/user/${userId}`);
                    set({ myVerification: response.data });
                } catch (error: any) {
                    // If 404, it just means no verification request exists yet
                    set({ error: error.response?.status === 404 ? null : (error.response?.data?.message || error.message || 'Failed to fetch verification') });
                    if (error.response?.status === 404) {
                        set({ myVerification: null });
                    }
                } finally {
                    set({ isLoading: false });
                }
            },

            requestVerification: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/verifications', data);
                    set({ myVerification: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to request verification' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateVerificationStatus: async (id, status, remarks) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/verifications/${id}/status`, { status, remarks });
                    set((state) => ({
                        verifications: state.verifications.map((v) =>
                            v._id === id ? response.data : v
                        )
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update verification status' });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'verification-storage',
        }
    )
);
