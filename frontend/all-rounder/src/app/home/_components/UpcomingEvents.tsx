"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useEventStore, Event } from "@/context/useEventStore";

export default function UpcomingEvents() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { events } = useEventStore();
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

    useEffect(() => {
        // Filter and sort events
        const now = new Date();
        const futureEvents = events
            .filter(event => {
                const eventDate = new Date(event.startDate);
                return eventDate >= now;
            })
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 3); // Take top 3

        // Map to display format if needed, or use directly
        const displayEvents = futureEvents;

        setUpcomingEvents(displayEvents);

    }, [events]);

    useEffect(() => {
        if (!containerRef.current || upcomingEvents.length === 0) return;

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
    }, [upcomingEvents]);

    return (
        <div ref={containerRef} className="bg-[var(--white)] rounded-2xl p-6 shadow-sm border border-[var(--gray-200)] transition-colors duration-300">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">Upcoming Events</h2>

            <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event, index) => (
                        <div key={index} className="event-item flex gap-4 p-3 rounded-xl hover:bg-[var(--gray-50)] transition-all cursor-pointer border border-transparent hover:border-[var(--gray-200)] opacity-0">
                            <div className="w-12 h-12 rounded-lg bg-[var(--secondary-pale-lavender)] flex items-center justify-center flex-shrink-0 text-[var(--primary-purple)]">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text-main)] text-sm line-clamp-1">
                                    {event.title}
                                </h3>
                                <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
                                    {new Date(event.startDate).toLocaleDateString()}
                                </p>
                                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-2 font-bold bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]">
                                    {event.category || 'Event'}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (

                    <p className="text-sm text-[var(--text-muted)]">No upcoming events found.</p>
                )}
            </div>

            <Link
                href="/events"
                className="block w-full text-center text-sm text-[var(--primary-blue)] font-medium mt-6 hover:underline"
            >
                View All Events
            </Link>
        </div>
    );
}
