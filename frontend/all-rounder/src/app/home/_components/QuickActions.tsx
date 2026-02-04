"use client";

import { UserCog, Trophy, FolderOpen, HeartHandshake, Medal, HelpCircle } from "lucide-react";
import Link from "next/link";

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
    return (
        <div className="bg-[var(--white)] rounded-2xl p-6 shadow-sm border border-[var(--gray-200)]">
            <h2 className="text-lg font-bold text-[var(--primary-dark-purple)] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--contact-bg)] hover:bg-[var(--secondary-purple-100)] transition-colors group text-center"
                    >
                        <action.icon className="w-6 h-6 text-[var(--primary-purple)] mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-[var(--primary-dark-purple)]">{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
