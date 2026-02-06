"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type OrganizerType = "School" | "Organization";

export interface Event {
    id: number;
    title: string;
    description: string;
    fullDescription?: string;
    date: string;
    deadline?: string;
    location: string;
    imageUrl: string;
    categories?: string[];
    status?: "Registered" | "Open";
    requirements?: string[];
    prizes?: string[];
    contactEmail?: string;
    time?: string;
    organizerId: string;
    organizerType: OrganizerType;
    isMajor?: boolean;
}

import { Events } from '@/app/events/_data/events';

interface EventState {
    events: Event[];
    activeEvent: Event | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setEvents: (events: Event[]) => void;
    addEvent: (event: Event) => void;
    updateEvent: (id: number, updates: Partial<Event>) => void;
    deleteEvent: (id: number) => void;
    setActiveEvent: (event: Event | null) => void;
    rsvpEvent: (eventId: number) => void;
    getEventById: (id: number) => Event | undefined;
}

export const useEventStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: Events, // Initialize with static data
            activeEvent: null,
            isLoading: false,
            error: null,

            setEvents: (events) => set({ events }),

            addEvent: (event) => set((state) => ({
                events: [...state.events, event]
            })),

            updateEvent: (id, updates) => set((state) => ({
                events: state.events.map((e) =>
                    e.id === id ? { ...e, ...updates } : e
                ),
                activeEvent: state.activeEvent?.id === id
                    ? { ...state.activeEvent, ...updates }
                    : state.activeEvent
            })),

            deleteEvent: (id) => set((state) => ({
                events: state.events.filter((e) => e.id !== id),
                activeEvent: state.activeEvent?.id === id ? null : state.activeEvent
            })),

            setActiveEvent: (event) => set({ activeEvent: event }),

            rsvpEvent: (eventId) => set((state) => ({
                events: state.events.map((e) => {
                    if (e.id === eventId) {
                        return { ...e, status: "Registered" };
                    }
                    return e;
                })
            })),

            getEventById: (id: number) => {
                return get().events.find(e => e.id === id);
            },
        }),
        {
            name: 'event-storage',
        }
    )
);
