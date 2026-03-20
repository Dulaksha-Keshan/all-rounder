"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { useToastStore, ToastItem } from "@/context/useToastStore";

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismissToast = useToastStore((state) => state.dismissToast);
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toastRef.current) return;

    gsap.fromTo(
      toastRef.current,
      { x: 48, opacity: 0, scale: 0.96 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      }
    );

    if (progressRef.current) {
      gsap.set(progressRef.current, { transformOrigin: "left center", scaleX: 1 });
      gsap.to(progressRef.current, {
        scaleX: 0,
        ease: "none",
        duration: toast.duration / 1000,
      });
    }
  }, []);

  const handleDismiss = () => {
    if (!toastRef.current) {
      dismissToast(toast.id);
      return;
    }

    gsap.to(toastRef.current, {
      x: 32,
      opacity: 0,
      scale: 0.98,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => dismissToast(toast.id),
    });
  };

  const variantClasses =
    toast.variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : toast.variant === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-[var(--secondary-light-lavender)] bg-[var(--secondary-pale-lavender)] text-[var(--primary-dark-purple)]";

  const Icon =
    toast.variant === "success"
      ? CheckCircle2
      : toast.variant === "error"
        ? AlertTriangle
        : Info;

  const iconColorClass =
    toast.variant === "success"
      ? "text-emerald-600"
      : toast.variant === "error"
        ? "text-rose-600"
        : "text-[var(--primary-blue)]";

  return (
    <div
      ref={toastRef}
      role="status"
      className={`pointer-events-auto w-[min(92vw,380px)] rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${variantClasses}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColorClass}`} />
        <p className="flex-1 text-sm font-semibold leading-5">{toast.message}</p>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={handleDismiss}
          className="rounded-md p-1 text-inherit/80 transition-colors hover:bg-black/5 hover:text-inherit"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10">
        <div
          ref={progressRef}
          className={`h-full w-full rounded-full ${
            toast.variant === "success"
              ? "bg-emerald-500/70"
              : toast.variant === "error"
                ? "bg-rose-500/70"
                : "bg-[var(--primary-blue)]/70"
          }`}
        />
      </div>
    </div>
  );
}

export default function AppToastHost() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[110] flex max-h-[calc(100vh-7rem)] flex-col gap-3 overflow-y-auto">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
