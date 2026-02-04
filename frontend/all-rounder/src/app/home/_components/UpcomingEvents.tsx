"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const events = [
    {
        title: "Math Olympiad Finals",
        date: "Dec 5, 2025",
        type: "Competition",
        color: "bg-blue-500/10 text-blue-500"
    },
    {
        title: "Art Exhibition Submission",
        date: "Dec 10, 2025",
        type: "Exhibition",
        color: "bg-[var(--primary-purple)]/10 text-[var(--primary-purple)]"
    },
    {
        title: "Scholarship Application",
        date: "Dec 15, 2025",
        type: "Opportunity",
        color: "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]"
    }
];

export default function UpcomingEvents() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const items = containerRef.current.querySelectorAll('.event-item');
        gsap.fromTo(items,
            { x: 20, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            }
        );
    }, []);

    return (
        <div ref={containerRef} className="bg-[var(--white)] rounded-2xl p-6 shadow-sm border border-[var(--gray-200)] transition-colors duration-300">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">Upcoming Events</h2>

            <div className="space-y-4">
                {events.map((event, index) => (
                    <div key={index} className="event-item flex gap-4 p-3 rounded-xl hover:bg-[var(--gray-50)] transition-all cursor-pointer border border-transparent hover:border-[var(--gray-200)] opacity-0">
                        <div className="w-12 h-12 rounded-lg bg-[var(--secondary-pale-lavender)] flex items-center justify-center flex-shrink-0 text-[var(--primary-purple)]">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--text-main)] text-sm line-clamp-1">
                                {event.title}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium mt-1">{event.date}</p>
                            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-2 font-bold ${event.color}`}>
                                {event.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <Link
                href="/calendar"
                className="block w-full text-center text-sm text-[var(--primary-blue)] font-medium mt-6 hover:underline"
            >
                View All Events
            </Link>
        </div>
    );
}
