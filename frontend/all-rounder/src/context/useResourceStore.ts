"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
                    const response = await fetch('/api/resources');
                    if (!response.ok) throw new Error('Failed to fetch resources');
                    const data = await response.json();
                    set({ resources: data });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            uploadResource: async (resourceData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/resources', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(resourceData)
                    });
                    if (!response.ok) throw new Error('Failed to upload resource');
                    const newResource = await response.json();

                    set((state) => ({
                        resources: [newResource, ...state.resources]
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteResource: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete resource');

                    set((state) => ({
                        resources: state.resources.filter(r => r.id !== id)
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
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
                    const response = await fetch(`/api/resources/${id}/download`, { method: 'POST' });
                    if (!response.ok) throw new Error('Failed to increment download');
                } catch (error) {
                    set({ error: (error as Error).message });
                }
            },
        }),
        {
            name: 'resource-storage',
        }
    )
);
