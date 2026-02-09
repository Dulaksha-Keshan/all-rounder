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

    // Actions
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: number) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,

            addNotification: (notification) => {
                const newNotification: Notification = {
                    ...notification,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                    isRead: false,
                };

                set((state) => ({
                    notifications: [newNotification, ...state.notifications],
                    unreadCount: state.unreadCount + 1
                }));
            },

            markAsRead: (id) => set((state) => {
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
            }),

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            })),

            deleteNotification: (id) => set((state) => {
                const notification = state.notifications.find(n => n.id === id);
                const decrement = notification && !notification.isRead ? 1 : 0;

                return {
                    notifications: state.notifications.filter(n => n.id !== id),
                    unreadCount: Math.max(0, state.unreadCount - decrement)
                };
            }),

            clearAll: () => set({ notifications: [], unreadCount: 0 }),
        }),
        {
            name: 'notification-storage',
        }
    )
);
