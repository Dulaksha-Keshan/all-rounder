"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { Notification } from '@/app/_type/type';



interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchNotifications: () => Promise<void>;
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
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
                    const response = await api.get('/notifications');
                    const data = response.data;
                    set({
                        notifications: data.notifications || [],
                        unreadCount: data.unreadCount || 0
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to fetch notifications' });
                } finally {
                    set({ isLoading: false });
                }
            },

            addNotification: async (notification) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/notifications', notification);
                    const newNotification = response.data;

                    set((state) => ({
                        notifications: [newNotification, ...state.notifications],
                        unreadCount: state.unreadCount + 1
                    }));
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to add notification' });
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
                    await api.put(`/notifications/${id}/read`);
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to mark as read' });
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
                    await api.put('/notifications/read-all');
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to mark all as read' });
                }
            },

            deleteNotification: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/notifications/${id}`);

                    set((state) => {
                        const notification = state.notifications.find(n => n.id === id);
                        const decrement = notification && !notification.isRead ? 1 : 0;
                        return {
                            notifications: state.notifications.filter(n => n.id !== id),
                            unreadCount: Math.max(0, state.unreadCount - decrement)
                        };
                    });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to delete notification' });
                } finally {
                    set({ isLoading: false });
                }
            },

            clearAll: async () => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete('/notifications');
                    set({ notifications: [], unreadCount: 0 });
                } catch (error: any) {
                    set({ error: error.response?.data?.message || error.message || 'Failed to clear notifications' });
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
