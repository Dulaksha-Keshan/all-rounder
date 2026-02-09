"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
    link?: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchNotifications: () => Promise<void>;
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: number) => Promise<void>;
    clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            isLoading: false,
            error: null,

            fetchNotifications: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/notifications');
                    if (!response.ok) throw new Error('Failed to fetch notifications');
                    const data = await response.json();
                    set({
                        notifications: data.notifications || [],
                        unreadCount: data.unreadCount || 0
                    });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            addNotification: async (notification) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/notifications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(notification)
                    });
                    if (!response.ok) throw new Error('Failed to add notification');
                    const newNotification = await response.json();

                    set((state) => ({
                        notifications: [newNotification, ...state.notifications],
                        unreadCount: state.unreadCount + 1
                    }));
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            markAsRead: async (id) => {
                // Optimistic update
                set((state) => {
                    const notification = state.notifications.find(n => n.id === id);
                    if (notification && !notification.isRead) {
                        return {
                            notifications: state.notifications.map(n =>
                                n.id === id ? { ...n, isRead: true } : n
                            ),
                            unreadCount: Math.max(0, state.unreadCount - 1)
                        };
                    }
                    return state;
                });

                try {
                    const response = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
                    if (!response.ok) throw new Error('Failed to mark as read');
                } catch (error) {
                    set({ error: (error as Error).message });
                    // Revert optimistic update if needed (complex without previous state)
                }
            },

            markAllAsRead: async () => {
                // Optimistic
                set((state) => ({
                    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                    unreadCount: 0
                }));

                try {
                    const response = await fetch('/api/notifications/read-all', { method: 'PUT' });
                    if (!response.ok) throw new Error('Failed to mark all as read');
                } catch (error) {
                    set({ error: (error as Error).message });
                }
            },

            deleteNotification: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to delete notification');

                    set((state) => {
                        const notification = state.notifications.find(n => n.id === id);
                        const decrement = notification && !notification.isRead ? 1 : 0;
                        return {
                            notifications: state.notifications.filter(n => n.id !== id),
                            unreadCount: Math.max(0, state.unreadCount - decrement)
                        };
                    });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },

            clearAll: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/notifications', { method: 'DELETE' });
                    if (!response.ok) throw new Error('Failed to clear notifications');
                    set({ notifications: [], unreadCount: 0 });
                } catch (error) {
                    set({ error: (error as Error).message });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'notification-storage',
        }
    )
);
