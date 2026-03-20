"use client";

import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (message: string, variant?: ToastVariant, duration?: number) => string;
  dismissToast: (id: string) => void;
}

const DEFAULT_DURATION_BY_VARIANT: Record<ToastVariant, number> = {
  success: 2600,
  info: 3200,
  error: 4600,
};

const MAX_VISIBLE_TOASTS = 4;
const DEDUPE_WINDOW_MS = 1400;

const timeoutByToastId = new Map<string, ReturnType<typeof setTimeout>>();
const lastShownAtByToastKey = new Map<string, number>();

const getToastKey = (message: string, variant: ToastVariant) => `${variant}:${message.trim()}`;

const scheduleDismiss = (id: string, duration: number, dismissToast: (id: string) => void) => {
  const existingTimeout = timeoutByToastId.get(id);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  const timeoutId = setTimeout(() => {
    dismissToast(id);
  }, duration);

  timeoutByToastId.set(id, timeoutId);
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (message, variant = "info", duration) => {
    const normalizedMessage = message.trim();
    if (!normalizedMessage) return "";

    const resolvedDuration = duration ?? DEFAULT_DURATION_BY_VARIANT[variant];
    const toastKey = getToastKey(normalizedMessage, variant);
    const now = Date.now();

    const existingToast = get().toasts.find(
      (toast) => toast.message.trim() === normalizedMessage && toast.variant === variant
    );

    if (existingToast && now - (lastShownAtByToastKey.get(toastKey) ?? 0) <= DEDUPE_WINDOW_MS) {
      lastShownAtByToastKey.set(toastKey, now);
      scheduleDismiss(existingToast.id, resolvedDuration, get().dismissToast);
      return existingToast.id;
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => {
      const nextToasts = [...state.toasts, { id, message: normalizedMessage, variant, duration: resolvedDuration }];

      if (nextToasts.length <= MAX_VISIBLE_TOASTS) {
        return { toasts: nextToasts };
      }

      const droppedToasts = nextToasts.slice(0, nextToasts.length - MAX_VISIBLE_TOASTS);
      droppedToasts.forEach((toast) => {
        const timeoutId = timeoutByToastId.get(toast.id);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutByToastId.delete(toast.id);
        }
      });

      return { toasts: nextToasts.slice(-MAX_VISIBLE_TOASTS) };
    });

    lastShownAtByToastKey.set(toastKey, now);
    scheduleDismiss(id, resolvedDuration, get().dismissToast);
    return id;
  },

  dismissToast: (id) => {
    const timeoutId = timeoutByToastId.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutByToastId.delete(id);
    }

    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
