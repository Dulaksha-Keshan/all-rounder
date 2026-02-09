"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import api from '@/lib/axios';

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'PDF' | 'Video' | 'Link' | 'Document';
    url: string;
    uploadedBy: {
        name: string;
        id: string;
    };
    uploadedAt: string;
    downloads: number;
    tags?: string[];
}

interface ResourceState {
    resources: Resource[];
    searchQuery: string;
    selectedType: string | 'All';
    isLoading: boolean;

    error: string | null;

    // Actions
    fetchResources: () => Promise<void>;
    uploadResource: (resource: Omit<Resource, 'id' | 'uploadedAt' | 'downloads'>) => Promise<void>;
    deleteResource: (id: string) => Promise<void>;
    setSearchQuery: (query: string) => void;
    filterByType: (type: string) => void;
    incrementDownload: (id: string) => Promise<void>;
}

export const useResourceStore = create<ResourceState>()(
    persist(
        (set) => ({
            resources: [],
            searchQuery: '',
            selectedType: 'All',
            isLoading: false,
            error: null,

            fetchResources: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/resources');
                    set({ resources: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch resources' });
                } finally {
                    set({ isLoading: false });
                }
            },

            uploadResource: async (resourceData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/resources', resourceData);
                    set((state) => ({
                        resources: [response.data, ...state.resources]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to upload resource' });
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
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete resource' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setSearchQuery: (query) => set({ searchQuery: query }),

            filterByType: (type) => set({ selectedType: type }),

            incrementDownload: async (id) => {
                // Optimistic
                set((state) => ({
                    resources: state.resources.map(r =>
                        r.id === id ? { ...r, downloads: r.downloads + 1 } : r
                    )
                }));

                try {
                    await api.post(`/resources/${id}/download`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to increment download' });
                }
            },
        }),
        {
            name: 'resource-storage',
        }
    )
);
