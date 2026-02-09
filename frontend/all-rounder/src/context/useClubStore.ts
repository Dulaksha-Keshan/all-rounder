"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Club {
    id: number;
    name: string;
    description: string;
    logoUrl?: string;
    schoolId?: string;
    membersCount: number;
    isJoined?: boolean;
    tags?: string[];
}

interface ClubState {
    clubs: Club[];
    myClubs: Club[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setClubs: (clubs: Club[]) => void;
    fetchClubs: () => Promise<void>;
    joinClub: (clubId: number) => Promise<void>;
    leaveClub: (clubId: number) => Promise<void>;
    createClub: (club: Omit<Club, 'id' | 'membersCount' | 'isJoined'>) => Promise<void>;
    updateClub: (id: number, updates: Partial<Club>) => Promise<void>;
    deleteClub: (id: number) => Promise<void>;
}

export const useClubStore = create<ClubState>()(
    persist(
        (set, get) => ({
            clubs: [],
            myClubs: [],
            isLoading: false,
            error: null,

            setClubs: (clubs) => set({ clubs }),

            fetchClubs: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/clubs');
                    if (!response.ok) throw new Error('Failed to fetch clubs');
                    const data = await response.json();
                    set({ clubs: data });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            joinClub: async (clubId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/clubs/${clubId}/join`, { method: 'POST' });
                    if (!response.ok) throw new Error('Failed to join club');

                    const club = get().clubs.find(c => c.id === clubId);
                    if (club && !club.isJoined) {
                        const updatedClub = { ...club, isJoined: true, membersCount: club.membersCount + 1 };
                        set(state => ({
                            clubs: state.clubs.map(c => c.id === clubId ? updatedClub : c),
                            myClubs: [...state.myClubs, updatedClub]
                        }));
                    }
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            leaveClub: async (clubId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/clubs/${clubId}/leave`, { method: 'POST' });
                    if (!response.ok) throw new Error('Failed to leave club');

                    set((state) => ({
                        clubs: state.clubs.map(c =>
                            c.id === clubId ? { ...c, isJoined: false, membersCount: Math.max(0, c.membersCount - 1) } : c
                        ),
                        myClubs: state.myClubs.filter(c => c.id !== clubId)
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            createClub: async (clubData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/clubs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(clubData)
                    });
                    if (!response.ok) throw new Error('Failed to create club');
                    const newClub = await response.json();

                    set((state) => ({
                        clubs: [...state.clubs, newClub],
                        myClubs: [...state.myClubs, newClub]
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateClub: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/clubs/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates)
                    });
                    if (!response.ok) throw new Error('Failed to update club');
                    const updated = await response.json();

                    set((state) => ({
                        clubs: state.clubs.map(c => c.id === id ? { ...c, ...updated } : c),
                        myClubs: state.myClubs.map(c => c.id === id ? { ...c, ...updated } : c)
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteClub: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/clubs/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete club');

                    set((state) => ({
                        clubs: state.clubs.filter(c => c.id !== id),
                        myClubs: state.myClubs.filter(c => c.id !== id)
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'club-storage',
        }
    )
);
