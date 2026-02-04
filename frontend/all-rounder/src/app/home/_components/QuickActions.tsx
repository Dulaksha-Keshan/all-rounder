"use client";

import { UserCog, Trophy, FolderOpen, HeartHandshake, Medal, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

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
        <div ref={containerRef} className="bg-[var(--white)] rounded-2xl p-6 shadow-sm border border-[var(--gray-200)] transition-colors duration-300">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
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
    );
}
