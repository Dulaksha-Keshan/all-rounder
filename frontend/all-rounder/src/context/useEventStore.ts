"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Event, CreateEventInput, UpdateEventInput } from '@/app/_type/type';
import api from '@/lib/axios';

// Roles that are permitted to create/update/delete events
export type EventAdminRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'ORG_ADMIN';

// Normalize the backend response (uses "id") to the frontend shape (uses "_id")
function normalizeEvent(raw: any): Event {
    return {
        ...raw,
        _id: raw.id ?? raw._id,
        attachments: raw.attachments ?? [],
    };
}

export interface EventPagination {
    page: number;
    pages: number;
    total: number;
    count: number;
}

interface EventState {
    events: Event[];
    activeEvent: Event | null;
    pagination: EventPagination;
    isLoading: boolean;
    error: string | null;

    // Actions
    setEvents: (events: Event[]) => void;
    fetchEvents: (page?: number, limit?: number) => Promise<void>;
    /** Create a new event. Only SCHOOL_ADMIN / ORG_ADMIN / SUPER_ADMIN should call this. */
    createEvent: (input: CreateEventInput) => Promise<Event | undefined>;
    updateEvent: (id: string, updates: UpdateEventInput) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    setActiveEvent: (event: Event | null) => void;
    rsvpEvent: (eventId: string) => Promise<void>;
    getEventById: (id: string) => Event | undefined; // Sync selector
    fetchEventById: (id: string) => Promise<Event | undefined>; // Async fetch
}

export const useEventStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: [],
            activeEvent: null,
            pagination: { page: 1, pages: 1, total: 0, count: 0 },
            isLoading: false,
            error: null,

            fetchEvents: async (page = 1, limit = 10) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/events', { params: { page, limit } });
                    // Backend returns { success, count, total, page, pages, data }
                    const { data, count, total, page: currentPage, pages } = response.data;
                    const normalized = (data as any[]).map(normalizeEvent);
                    set({
                        events: normalized,
                        pagination: { page: currentPage, pages, total, count },
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch events' });
                } finally {
                    set({ isLoading: false });
                }
            },

            setEvents: (events) => set({ events }),

            createEvent: async (input: CreateEventInput) => {
                set({ isLoading: true, error: null });
                try {
                    const formData = new FormData();

                    // Required fields
                    formData.append('title', input.title);
                    formData.append('description', input.description);
                    formData.append('category', input.category);
                    formData.append('eventType', input.eventType);
                    formData.append('startDate', input.startDate);
                    formData.append('endDate', input.endDate);
                    formData.append('location', input.location);
                    formData.append('organizer', input.organizer);
                    formData.append('eligibility', input.eligibility);

                    // Optional fields
                    if (input.registrationUrl) formData.append('registrationUrl', input.registrationUrl);
                    if (input.isOnline !== undefined) formData.append('isOnline', String(input.isOnline));
                    if (input.visibility) formData.append('visibility', input.visibility);

                    // hosts must be serialized as JSON string for multipart
                    if (input.hosts && input.hosts.length > 0) {
                        formData.append('hosts', JSON.stringify(input.hosts));
                    }

                    // File attachments
                    if (input.attachments && input.attachments.length > 0) {
                        input.attachments.forEach((file) => formData.append('attachments', file));
                    }

                    const response = await api.post('/events', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });

                    // Backend returns { message, event }
                    const created = normalizeEvent(response.data.event);

                    set((state) => ({ events: [...state.events, created] }));
                    return created;
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to create event' });
                    return undefined;
                } finally {
                    set({ isLoading: false });
                }
            },

            updateEvent: async (id, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const formData = new FormData();

                    if (updates.title !== undefined) formData.append('title', updates.title);
                    if (updates.description !== undefined) formData.append('description', updates.description);
                    if (updates.category !== undefined) formData.append('category', updates.category);
                    if (updates.eventType !== undefined) formData.append('eventType', updates.eventType);
                    if (updates.startDate !== undefined) formData.append('startDate', updates.startDate);
                    if (updates.endDate !== undefined) formData.append('endDate', updates.endDate);
                    if (updates.location !== undefined) formData.append('location', updates.location);
                    if (updates.organizer !== undefined) formData.append('organizer', updates.organizer);
                    if (updates.eligibility !== undefined) formData.append('eligibility', updates.eligibility);
                    if (updates.registrationUrl !== undefined) formData.append('registrationUrl', updates.registrationUrl);
                    if (updates.isOnline !== undefined) formData.append('isOnline', String(updates.isOnline));
                    if (updates.visibility !== undefined) formData.append('visibility', updates.visibility);
                    if (updates.hosts && updates.hosts.length > 0) formData.append('hosts', JSON.stringify(updates.hosts));
                    if (updates.attachments && updates.attachments.length > 0) {
                        updates.attachments.forEach((file) => formData.append('attachments', file));
                    }

                    const response = await api.put(`/events/${id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });

                    // Backend returns { message, event }
                    const updated = normalizeEvent(response.data.event);

                    set((state) => ({
                        events: state.events.map((e) => e._id === id ? updated : e),
                        activeEvent: state.activeEvent?._id === id ? updated : state.activeEvent,
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
                        events: state.events.filter((e) => e._id !== id),
                        activeEvent: state.activeEvent?._id === id ? null : state.activeEvent
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
                            if (e._id === eventId) {
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
                return get().events.find(e => e._id === id);
            },

            fetchEventById: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/events/${id}`);
                    // Backend returns { event, hostDetails }
                    // Use event.hosts for stable rendering; hostDetails may contain enriched mapping data
                    const { event, hostDetails } = response.data;
                    const mergedHosts = event.hosts?.length ? event.hosts : (hostDetails ?? []);
                    const fullEvent = normalizeEvent({ ...event, hosts: mergedHosts });

                    set((state) => ({
                        events: state.events.some(e => e._id === id)
                            ? state.events.map(e => e._id === id ? fullEvent : e)
                            : [...state.events, fullEvent],
                        activeEvent: fullEvent
                    }));
                    return fullEvent;
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch event' });
                    return undefined;
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'event-storage',
            partialize: (state) => ({
                events: state.events,
                activeEvent: state.activeEvent,
                pagination: state.pagination,
            }),
        }
    )
);
