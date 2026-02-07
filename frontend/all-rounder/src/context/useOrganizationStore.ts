"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Organization } from '@/app/_type/type';

interface OrganizationState {
    organizations: Organization[];
    activeOrganization: Organization | null;
    isLoading: boolean;

    // Actions
    setOrganizations: (organizations: Organization[]) => void;
    addOrganization: (org: Organization) => void;
    updateOrganization: (id: string, updates: Partial<Organization>) => void;
    deleteOrganization: (id: string) => void;
    setActiveOrganization: (org: Organization | null) => void;
}

export const useOrganizationStore = create<OrganizationState>()(
    persist(
        (set) => ({
            organizations: [],
            activeOrganization: null,
            isLoading: false,

            setOrganizations: (organizations) => set({ organizations }),

            addOrganization: (org) => set((state) => ({
                organizations: [...state.organizations, org]
            })),

            updateOrganization: (id, updates) => set((state) => ({
                organizations: state.organizations.map(o =>
                    o.id === id ? { ...o, ...updates } : o
                ),
                activeOrganization: state.activeOrganization?.id === id
                    ? { ...state.activeOrganization, ...updates }
                    : state.activeOrganization
            })),

            deleteOrganization: (id) => set((state) => ({
                organizations: state.organizations.filter(o => o.id !== id),
                activeOrganization: state.activeOrganization?.id === id ? null : state.activeOrganization
            })),

            setActiveOrganization: (org) => set({ activeOrganization: org }),
        }),
        {
            name: 'organization-storage',
        }
    )
);
