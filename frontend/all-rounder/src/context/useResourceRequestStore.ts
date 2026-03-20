"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import {
    CreateResourceRequestInput,
    ResourceRequest,
    ResourceRequestQuery,
    ResourceRequestWithSchool,
    UpdateResourceRequestInput,
} from '@/app/_type/type';

type BackendResourceRequest = Omit<ResourceRequest, 'id'> & {
    _id?: string;
    id?: string;
};

interface BackendResourceWithSchool {
    request: BackendResourceRequest;
    school: ResourceRequestWithSchool['school'];
}

interface ResourceRequestState {
    resources: ResourceRequestWithSchool[];
    activeResource?: ResourceRequestWithSchool;
    isLoading: boolean;
    isFetchingResources: boolean;
    isMutatingResource: boolean;
    error: string | null;

    fetchResources: (params?: ResourceRequestQuery) => Promise<void>;
    fetchResourceById: (id: string) => Promise<ResourceRequestWithSchool | undefined>;
    createResource: (schoolId: string, payload: CreateResourceRequestInput) => Promise<ResourceRequestWithSchool | undefined>;
    updateResource: (id: string, updates: UpdateResourceRequestInput) => Promise<ResourceRequest | undefined>;
    deleteResource: (id: string) => Promise<void>;
    searchResources: (params?: ResourceRequestQuery) => Promise<void>;
    setActiveResource: (resource?: ResourceRequestWithSchool) => void;
    clearError: () => void;
}

const normalizeRequest = (request: BackendResourceRequest): ResourceRequest => ({
    ...request,
    id: request.id ?? request._id ?? '',
});

const normalizeResourceWithSchool = (resource: BackendResourceWithSchool): ResourceRequestWithSchool => ({
    request: normalizeRequest(resource.request),
    school: resource.school,
});

const upsertResource = (
    resources: ResourceRequestWithSchool[],
    incoming: ResourceRequestWithSchool
): ResourceRequestWithSchool[] => {
    const index = resources.findIndex((item) => item.request.id === incoming.request.id);

    if (index === -1) {
        return [incoming, ...resources];
    }

    const next = [...resources];
    next[index] = incoming;
    return next;
};

export const useResourceRequestStore = create<ResourceRequestState>()(
    persist(
        (set, get) => ({
            resources: [],
            activeResource: undefined,
            isLoading: false,
            isFetchingResources: false,
            isMutatingResource: false,
            error: null,

            fetchResources: async (params) => {
                set({ isLoading: true, isFetchingResources: true, error: null });
                try {
                    const response = await api.get('/resources', { params });
                    const normalizedResources = ((response.data.resources ?? []) as BackendResourceWithSchool[])
                        .map(normalizeResourceWithSchool)
                        .filter((entry) => Boolean(entry.request.id));

                    set({ resources: normalizedResources });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch resources' });
                } finally {
                    set({ isLoading: false, isFetchingResources: false });
                }
            },

            fetchResourceById: async (id) => {
                set({ isLoading: true, isFetchingResources: true, error: null });
                try {
                    const response = await api.get(`/resources/${id}`);
                    const resource = normalizeResourceWithSchool({
                        request: response.data.request as BackendResourceRequest,
                        school: response.data.school ?? null,
                    });

                    set((state) => ({
                        resources: upsertResource(state.resources, resource),
                        activeResource: resource,
                    }));
                    return resource;
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch resource' });
                    return undefined;
                } finally {
                    set({ isLoading: false, isFetchingResources: false });
                }
            },

            createResource: async (schoolId, payload) => {
                set({ isLoading: true, isMutatingResource: true, error: null });
                try {
                    const response = await api.post(`/resources/schools/${schoolId}`, payload);
                    const newResource = normalizeResourceWithSchool({
                        request: response.data.request as BackendResourceRequest,
                        school: response.data.school ?? null,
                    });

                    set((state) => ({
                        resources: upsertResource(state.resources, newResource),
                        activeResource: newResource,
                    }));
                    return newResource;
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create resource request' });
                    return undefined;
                } finally {
                    set({ isLoading: false, isMutatingResource: false });
                }
            },

            updateResource: async (id, updates) => {
                set({ isLoading: true, isMutatingResource: true, error: null });
                try {
                    const response = await api.put(`/resources/${id}`, updates);
                    const updatedRequest = normalizeRequest(response.data.updatedResource as BackendResourceRequest);

                    set((state) => ({
                        resources: state.resources.map((resource) =>
                            resource.request.id === id
                                ? { ...resource, request: updatedRequest }
                                : resource
                        )
                    }));
                    return updatedRequest;
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update resource request' });
                    return undefined;
                } finally {
                    set({ isLoading: false, isMutatingResource: false });
                }
            },

            deleteResource: async (id) => {
                set({ isLoading: true, isMutatingResource: true, error: null });
                try {
                    await api.delete(`/resources/${id}`);

                    set((state) => ({
                        resources: state.resources.filter((resource) => resource.request.id !== id),
                        activeResource: state.activeResource?.request.id === id ? undefined : state.activeResource,
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete resource request' });
                } finally {
                    set({ isLoading: false, isMutatingResource: false });
                }
            },

            searchResources: async (params) => {
                set({ isLoading: true, isFetchingResources: true, error: null });
                try {
                    const response = await api.get('/resources/search', {
                        params,
                    });
                    const normalizedResources = ((response.data.resources ?? []) as BackendResourceWithSchool[])
                        .map(normalizeResourceWithSchool)
                        .filter((entry) => Boolean(entry.request.id));
                    set({ resources: normalizedResources });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to search resources' });
                } finally {
                    set({ isLoading: false, isFetchingResources: false });
                }
            },

            setActiveResource: (resource) => {
                set({ activeResource: resource });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'resource-request-storage',
            partialize: (state) => ({
                resources: state.resources,
                activeResource: state.activeResource,
            }),
        }
    )
);
