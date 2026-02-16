"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type OrganizerType = "School" | "Organization";

export interface Host {
    hostType: "school" | "organization";
    hostId: string;
    hostName: string;
    isPrimary: boolean;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    category: string;
    eventType: "workshop" | "competition" | "seminar" | "webinar" | "conference" | "other";
    startDate: string; 
    endDate: string;   // ISO date string
    location: string;
    organizer: string; // Name or ID string from schema
    hosts?: Host[];
    eligibility: string;
    registrationUrl?: string;
    isOnline: boolean;
    visibility: "public" | "private";
    createdBy: string; // User ID
    isDeleted?: boolean;

    // UI/Legacy fields (kept for compatibility or derived)
    imageUrl?: string;
    status?: "Registered" | "Open";
    requirements?: string[]; // Not in schema, keeping for UI
    prizes?: string[]; // Not in schema, keeping for UI
    contactEmail?: string; // Not in schema, keeping for UI
    time?: string; // Derived from startDate
}

import { Events } from '@/app/events/_data/events';
import api from '@/lib/axios';

interface EventState {
    events: Event[];
    activeEvent: Event | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setEvents: (events: Event[]) => void;
    fetchEvents: () => Promise<void>;
    addEvent: (event: Event) => Promise<void>;
    updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    setActiveEvent: (event: Event | null) => void;
    rsvpEvent: (eventId: string) => Promise<void>;
    getEventById: (id: string) => Event | undefined;
}

export const useEventStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: Events, // Initialize with static data
            activeEvent: null,
            isLoading: false,
            error: null,

            fetchEvents: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/events');
                    set({ events: response.data });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch events' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setEvents: (events) => set({ events }),

            addEvent: async (event) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/events', event);
                    set((state) => ({
                        events: [...state.events, response.data]
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create event' });
                } finally {
                    set({ isLoading: false });
                }
            },

            updateEvent: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.put(`/events/${id}`, updates);
                    const updated = response.data;

                    set((state) => ({
                        events: state.events.map((e) =>
                            e.id === id ? { ...e, ...updated } : e
                        ),
                        activeEvent: state.activeEvent?.id === id
                            ? { ...state.activeEvent, ...updated }
                            : state.activeEvent
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to update event' });
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteEvent: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/events/${id}`);

                    set((state) => ({
                        events: state.events.filter((e) => e.id !== id),
                        activeEvent: state.activeEvent?.id === id ? null : state.activeEvent
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete event' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setActiveEvent: (event) => set({ activeEvent: event }),

            rsvpEvent: async (eventId) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post(`/events/${eventId}/rsvp`);

                    // Optimistic or response-based
                    set((state) => ({
                        events: state.events.map((e) => {
                            if (e.id === eventId) {
                                return { ...e, status: "Registered" };
                            }
                            return e;
                        })
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to RSVP' });
                } finally {
                    set({ isLoading: false });
                }
            },

            getEventById: (id: string) => {
                return get().events.find(e => e.id === id);
            },
        }),
        {
            name: 'event-storage',
        }
    )
);
