"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import api from '@/lib/axios';

export interface Club {
    id: string; 
    name: string;
    description: string;
    category: string;
    logoUrl?: string;
    schoolId: string;
    schoolName: string;
    foundedYear?: number;
    teacherInCharge?: {
        name: string;
        email?: string;
        contacts?: string;
    };
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
    };
    visibility: "public" | "private";
    membersCount: number;
    isJoined?: boolean;
    tags?: string[];
    createdAt?: string;
}

interface ClubState {
    clubs: Club[];
    myClubs: Club[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setClubs: (clubs: Club[]) => void;
    fetchClubs: () => Promise<void>;
    joinClub: (clubId: string) => Promise<void>;
    leaveClub: (clubId: string) => Promise<void>;
    createClub: (club: Omit<Club, 'id' | 'membersCount' | 'isJoined'>) => Promise<void>;
    updateClub: (id: string, updates: Partial<Club>) => Promise<void>;
    deleteClub: (id: string) => Promise<void>;
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
                    const response = await api.get('/clubs');
                    set({ clubs: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch clubs' });
                } finally {
                    set({ isLoading: false });
                }
            },

            joinClub: async (clubId) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post(`/clubs/${clubId}/join`);

                    const club = get().clubs.find(c => c.id === clubId);
                    if (club && !club.isJoined) {
                        const updatedClub = { ...club, isJoined: true, membersCount: club.membersCount + 1 };
                        set(state => ({
                            clubs: state.clubs.map(c => c.id === clubId ? updatedClub : c),
                            myClubs: [...state.myClubs, updatedClub]
                        }));
                    }
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to join club' });
                } finally {
                    set({ isLoading: false });
                }
            },

            leaveClub: async (clubId) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post(`/clubs/${clubId}/leave`);

                    set((state) => ({
                        clubs: state.clubs.map(c =>
                            c.id === clubId ? { ...c, isJoined: false, membersCount: Math.max(0, c.membersCount - 1) } : c
                        ),
                        myClubs: state.myClubs.filter(c => c.id !== clubId)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to leave club' });
                } finally {
                    set({ isLoading: false });
                }
            },

            createClub: async (clubData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/clubs', clubData);
                    set((state) => ({
                        clubs: [...state.clubs, response.data],
                        myClubs: [...state.myClubs, response.data]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create club' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateClub: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/clubs/${id}`, updates);
                    const updated = response.data;

                    set((state) => ({
                        clubs: state.clubs.map(c => c.id === id ? { ...c, ...updated } : c),
                        myClubs: state.myClubs.map(c => c.id === id ? { ...c, ...updated } : c)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update club' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteClub: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/clubs/${id}`);

                    set((state) => ({
                        clubs: state.clubs.filter(c => c.id !== id),
                        myClubs: state.myClubs.filter(c => c.id !== id)
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete club' });
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
