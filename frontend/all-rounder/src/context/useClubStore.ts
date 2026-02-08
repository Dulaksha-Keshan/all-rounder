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

    // Actions
    setClubs: (clubs: Club[]) => void;
    joinClub: (clubId: number) => void;
    leaveClub: (clubId: number) => void;
    createClub: (club: Omit<Club, 'id' | 'membersCount' | 'isJoined'>) => void;
}

export const useClubStore = create<ClubState>()(
    persist(
        (set) => ({
            clubs: [],
            myClubs: [],
            isLoading: false,

            setClubs: (clubs) => set({ clubs }),

            joinClub: (clubId) => set((state) => {
                const club = state.clubs.find(c => c.id === clubId);
                if (club && !club.isJoined) {
                    const updatedClub = { ...club, isJoined: true, membersCount: club.membersCount + 1 };
                    return {
                        clubs: state.clubs.map(c => c.id === clubId ? updatedClub : c),
                        myClubs: [...state.myClubs, updatedClub]
                    };
                }
                return state;
            }),

            leaveClub: (clubId) => set((state) => ({
                clubs: state.clubs.map(c =>
                    c.id === clubId ? { ...c, isJoined: false, membersCount: Math.max(0, c.membersCount - 1) } : c
                ),
                myClubs: state.myClubs.filter(c => c.id !== clubId)
            })),

            createClub: (clubData) => set((state) => {
                const newClub: Club = {
                    ...clubData,
                    id: Date.now(),
                    membersCount: 1,
                    isJoined: true
                };
                return {
                    clubs: [...state.clubs, newClub],
                    myClubs: [...state.myClubs, newClub]
                };
            }),
        }),
        {
            name: 'club-storage',
        }
    )
);
