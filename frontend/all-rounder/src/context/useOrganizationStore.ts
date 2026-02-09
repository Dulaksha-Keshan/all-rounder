"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Organization } from '@/app/_type/type';
import { Organizations } from '@/app/_data/data';

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
                    const response = await fetch('/api/organizations');
                    if (!response.ok) throw new Error('Failed to fetch organizations');
                    const data = await response.json();
                    set({ organizations: data });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            addOrganization: async (org) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/organizations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(org)
                    });
                    if (!response.ok) throw new Error('Failed to add organization');
                    const newOrg = await response.json();

                    set((state) => ({
                        organizations: [...state.organizations, newOrg]
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateOrganization: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/organizations/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates)
                    });
                    if (!response.ok) throw new Error('Failed to update organization');
                    const updated = await response.json();

                    set((state) => ({
                        organizations: state.organizations.map(o =>
                            o.id === id ? { ...o, ...updated } : o
                        ),
                        activeOrganization: state.activeOrganization?.id === id
                            ? { ...state.activeOrganization, ...updated }
                            : state.activeOrganization
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteOrganization: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/organizations/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete organization');

                    set((state) => ({
                        organizations: state.organizations.filter(o => o.id !== id),
                        activeOrganization: state.activeOrganization?.id === id ? null : state.activeOrganization
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            setActiveOrganization: (org) => set({ activeOrganization: org }),

            getOrganizationById: (id: string) => {
                return get().organizations.find(o => o.id === id);
            },
        }),
        {
            name: 'organization-storage',
        }
    )
);
