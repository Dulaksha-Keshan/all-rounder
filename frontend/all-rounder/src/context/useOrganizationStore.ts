"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Organization } from '@/app/_type/type';
import { Organizations } from '@/app/_data/data';
import api from '@/lib/axios';

interface OrganizationState {
    organizations: Organization[];
    activeOrganization: Organization | null;
    isLoading: boolean;

    // Actions
    error: string | null;

    // Actions
    setOrganizations: (organizations: Organization[]) => void;
    fetchOrganizations: () => Promise<void>;
    addOrganization: (org: Organization) => Promise<void>;
    updateOrganization: (id: string, updates: Partial<Organization>) => Promise<void>;
    deleteOrganization: (id: string) => Promise<void>;
    setActiveOrganization: (org: Organization | null) => void;
    getOrganizationById: (id: string) => Organization | undefined;
}

export const useOrganizationStore = create<OrganizationState>()(
    persist(
        (set, get) => ({
            organizations: Organizations,
            activeOrganization: null,
            isLoading: false,
            error: null,

            setOrganizations: (organizations) => set({ organizations }),

            fetchOrganizations: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/organizations');
                    set({ organizations: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch organizations' });
                } finally {
                    set({ isLoading: false });
                }
            },

            addOrganization: async (org) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/organizations', org);
                    set((state) => ({
                        organizations: [...state.organizations, response.data]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to add organization' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateOrganization: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/organizations/${id}`, updates);
                    const updated = response.data;

                    set((state) => ({
                        organizations: state.organizations.map(o =>
                            o.organization_id === id ? { ...o, ...updated } : o
                        ),
                        activeOrganization: state.activeOrganization?.organization_id === id
                            ? { ...state.activeOrganization, ...updated }
                            : state.activeOrganization
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update organization' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteOrganization: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/organizations/${id}`);

                    set((state) => ({
                        organizations: state.organizations.filter(o => o.organization_id !== id),
                        activeOrganization: state.activeOrganization?.organization_id === id ? null : state.activeOrganization
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete organization' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setActiveOrganization: (org) => set({ activeOrganization: org }),

            getOrganizationById: (id: string) => {
                return get().organizations.find(o => o.organization_id === id);
            },
        }),
        {
            name: 'organization-storage',
        }
    )
);
