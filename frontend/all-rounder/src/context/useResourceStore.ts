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

    // Actions
    uploadResource: (resource: Omit<Resource, 'id' | 'uploadedAt' | 'downloads'>) => void;
    deleteResource: (id: string) => void;
    setSearchQuery: (query: string) => void;
    filterByType: (type: string) => void;
    incrementDownload: (id: string) => void;
}

export const useResourceStore = create<ResourceState>()(
    persist(
        (set) => ({
            resources: [],
            searchQuery: '',
            selectedType: 'All',
            isLoading: false,

            uploadResource: (resourceData) => set((state) => {
                const newResource: Resource = {
                    ...resourceData,
                    id: Date.now().toString(),
                    uploadedAt: new Date().toISOString(),
                    downloads: 0
                };
                return { resources: [newResource, ...state.resources] };
            }),

            deleteResource: (id) => set((state) => ({
                resources: state.resources.filter(r => r.id !== id)
            })),

            setSearchQuery: (query) => set({ searchQuery: query }),

            filterByType: (type) => set({ selectedType: type }),

            incrementDownload: (id) => set((state) => ({
                resources: state.resources.map(r =>
                    r.id === id ? { ...r, downloads: r.downloads + 1 } : r
                )
            })),
        }),
        {
            name: 'resource-storage',
        }
    )
);
