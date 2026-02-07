"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Event } from '@/app/_type/type';

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
}

export const useEventStore = create<EventState>()(
    persist(
        (set) => ({
            events: [],
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
        }),
        {
            name: 'event-storage',
        }
    )
);
