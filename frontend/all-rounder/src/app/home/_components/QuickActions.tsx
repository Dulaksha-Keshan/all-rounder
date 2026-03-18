"use client";

import { UserCog, Trophy, FolderOpen, HeartHandshake, Medal, HelpCircle, CalendarPlus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import EventCreator from "./EventCreator";
import { useUserStore } from "@/context/useUserStore";

const actions = [
    {
        label: "Update Profile",
        icon: UserCog,
        href: "/user/profile/edit"
    },
    {
        label: "Browse Competitions",
        icon: Trophy,
        href: "/competitions"
    },
    {
        label: "View Resources",
        icon: FolderOpen,
        href: "/resources"
    },
    {
        label: "Support Campaigns",
        icon: HeartHandshake,
        href: "/campaigns"
    },
    {
        label: "View Leaderboard",
        icon: Medal,
        href: "/leaderboard"
    },
    {
        label: "Get Help",
        icon: HelpCircle,
        href: "/help"
    }
];

export default function QuickActions() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const userRole = useUserStore((state) => state.userRole);
    const canCreateEvents = userRole === "SCHOOL_ADMIN" || userRole === "ORG_ADMIN";

    useEffect(() => {
        if (!containerRef.current) return;

        const actions = containerRef.current.querySelectorAll('.action-item');
        gsap.fromTo(actions,
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: "back.out(1.2)"
            }
        );
    }, []);

    return (
        <>
            <div ref={containerRef} className="bg-[var(--white)] rounded-2xl p-6 shadow-sm border border-[var(--gray-200)] transition-colors duration-300">
                <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    {canCreateEvents && (
                        <button
                            type="button"
                            onClick={() => setIsEventModalOpen(true)}
                            className="action-item flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--gray-50)] hover:bg-[var(--secondary-light-lavender)]/20 border border-[var(--gray-100)] transition-all group text-center opacity-0"
                        >
                            <CalendarPlus className="w-6 h-6 text-[var(--primary-purple)] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-[var(--text-main)]">Create Event</span>
                        </button>
                    )}

                    {actions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className="action-item flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--gray-50)] hover:bg-[var(--secondary-light-lavender)]/20 border border-[var(--gray-100)] transition-all group text-center opacity-0"
                        >
                            <action.icon className="w-6 h-6 text-[var(--primary-purple)] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-[var(--text-main)]">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {isEventModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsEventModalOpen(false)}
                        aria-label="Close event creator"
                    />

                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-[var(--text-main)]">Create Event</h3>
                            <button
                                type="button"
                                onClick={() => setIsEventModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <EventCreator onCreated={() => setIsEventModalOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
