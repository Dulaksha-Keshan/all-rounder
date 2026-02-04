"use client";

import { Eye, Trophy, Calendar, Heart } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HomeStatsProps {
    stats: {
        views: number;
        achievements: number;
        events: number;
        contributions: number;
    };
}

export default function HomeStats({ stats }: HomeStatsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const statItems = [
        {
            label: "Profile Views",
            value: stats.views.toLocaleString(),
            icon: Eye,
            color: "bg-blue-500/10 text-blue-500",
            trend: "up"
        },
        {
            label: "Achievements",
            value: stats.achievements.toString(),
            icon: Trophy,
            color: "bg-[var(--primary-purple)]/10 text-[var(--primary-purple)]",
            trend: "up"
        },
        {
            label: "Upcoming Events",
            value: stats.events.toString(),
            icon: Calendar,
            color: "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]",
            trend: "up"
        },
        {
            label: "Contributions",
            value: stats.contributions.toString(),
            icon: Heart,
            color: "bg-pink-500/10 text-pink-500",
            trend: "up"
        }
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        const cards = containerRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(cards,
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }
        );
    }, []);

    return (
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statItems.map((stat, index) => (
                <div
                    key={index}
                    className="stat-card bg-[var(--white)] p-4 rounded-2xl shadow-sm border border-[var(--gray-200)] hover:shadow-md transition-all duration-300 opacity-0"
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
