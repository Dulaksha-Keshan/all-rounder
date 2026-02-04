"use client";

import { Eye, Trophy, Calendar, Heart } from "lucide-react";

interface HomeStatsProps {
    stats: {
        views: number;
        achievements: number;
        events: number;
        contributions: number;
    };
}

export default function HomeStats({ stats }: HomeStatsProps) {
    const statItems = [
        {
            label: "Profile Views",
            value: stats.views.toLocaleString(),
            icon: Eye,
            color: "bg-blue-100 text-blue-600",
            trend: "up"
        },
        {
            label: "Achievements",
            value: stats.achievements.toString(),
            icon: Trophy,
            color: "bg-purple-100 text-purple-600",
            trend: "up"
        },
        {
            label: "Upcoming Events",
            value: stats.events.toString(),
            icon: Calendar,
            color: "bg-indigo-100 text-indigo-600",
            trend: "up"
        },
        {
            label: "Contributions",
            value: stats.contributions.toString(),
            icon: Heart,
            color: "bg-pink-100 text-pink-600",
            trend: "up"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statItems.map((stat, index) => (
                <div
                    key={index}
                    className="bg-[var(--white)] p-4 rounded-2xl shadow-sm border border-[var(--gray-200)] hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        {stat.trend === "up" && (
                            <span className="text-green-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--gray-600)] mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-[var(--primary-dark-purple)]">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
