"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { ResourceRequest } from '@/app/_type/type';

interface ResourceRequestState {
    resources: ResourceRequest[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchResources: (params?: { status?: string; resourceType?: string; visibility?: string }) => Promise<void>;
    fetchResourceById: (id: string) => Promise<ResourceRequest | undefined>;
    createResource: (resource: Omit<ResourceRequest, 'id' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateResource: (id: string, updates: Partial<ResourceRequest>) => Promise<void>;
    deleteResource: (id: string) => Promise<void>;
    searchResources: (keyword: string) => Promise<void>;
}

export const useResourceRequestStore = create<ResourceRequestState>()(
    persist(
        (set, get) => ({
            resources: [],
            isLoading: false,
            error: null,

            fetchResources: async (params) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/resources', { params });
                    set({ resources: response.data.resources });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch resources' });
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchResourceById: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/resources/${id}`);
                    const resource = response.data.resource;

                    set((state) => ({
                        resources: state.resources.some(r => r.id === id)
                            ? state.resources.map(r => r.id === id ? resource : r)
                            : [...state.resources, resource]
                    }));
                    return resource;
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch resource' });
                    return undefined;
                } finally {
                    set({ isLoading: false });
                }
            },

            createResource: async (resourceData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/resources', resourceData);
                    const newResource = response.data.resourceRequest;

                    set((state) => ({
                        resources: [newResource, ...state.resources]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create resource request' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateResource: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/resources/${id}`, updates);
                    const updatedResource = response.data.updatedResource;

                    set((state) => ({
                        resources: state.resources.map(r =>
                            r.id === id ? updatedResource : r
                        )
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update resource request' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteResource: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/resources/${id}`);

                    set((state) => ({
                        resources: state.resources.filter(r => r.id !== id)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete resource request' });
                } finally {
                    set({ isLoading: false });
                }
            },

            searchResources: async (keyword) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/resources/search', {
                        params: { keyword }
                    });
                    set({ resources: response.data.resources });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to search resources' });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'resource-request-storage',
        }
    )
);
