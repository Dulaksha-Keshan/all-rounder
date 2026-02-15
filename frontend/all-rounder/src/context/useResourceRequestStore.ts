"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

export interface ResourceRequest {
    id: string;
    title: string;
    description: string;
    resourceType: "funding" | "equipment" | "mentorship" | "venue" | "software" | "other";
    quantity: number;
    urgency: "low" | "medium" | "high";
    requestedFor: string;
    neededBy?: string; // Date string
    status: "pending" | "approved" | "rejected" | "fulfilled";
    visibility: "public" | "private";
    createdBy: string; // User ID
    remarks?: string;
    contactNumber?: string;
    email?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface ResourceRequestState {
    requests: ResourceRequest[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchRequests: () => Promise<void>;
    createRequest: (request: Omit<ResourceRequest, 'id' | 'status' | 'isDeleted' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateRequest: (id: string, updates: Partial<ResourceRequest>) => Promise<void>;
    deleteRequest: (id: string) => Promise<void>;
    getRequestById: (id: string) => ResourceRequest | undefined;
}

export const useResourceRequestStore = create<ResourceRequestState>()(
    persist(
        (set, get) => ({
            requests: [],
            isLoading: false,
            error: null,

            fetchRequests: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/resource-requests');
                    set({ requests: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch resource requests' });
                } finally {
                    set({ isLoading: false });
                }
            },

            createRequest: async (requestData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/resource-requests', requestData);
                    set((state) => ({
                        requests: [response.data, ...state.requests]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create resource request' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateRequest: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/resource-requests/${id}`, updates);
                    const updated = response.data;
                    set((state) => ({
                        requests: state.requests.map((r) => r.id === id ? { ...r, ...updated } : r)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update resource request' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteRequest: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/resource-requests/${id}`);
                    set((state) => ({
                        requests: state.requests.filter((r) => r.id !== id)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete resource request' });
                } finally {
                    set({ isLoading: false });
                }
            },

            getRequestById: (id) => get().requests.find((r) => r.id === id),
        }),
        {
            name: 'resource-request-storage',
        }
    )
);
