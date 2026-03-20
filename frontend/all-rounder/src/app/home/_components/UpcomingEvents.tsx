"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useEventStore } from "@/context/useEventStore";
import { useSchoolStore } from "@/context/useSchoolStore";
import { useUserStore } from "@/context/useUserStore";
import { Event } from "@/app/_type/type";

const parseEventTime = (value: unknown): number => {
    if (value instanceof Date) {
        const time = value.getTime();
        return Number.isFinite(time) ? time : NaN;
    }

    if (typeof value === "string") {
        const parsed = new Date(value).getTime();
        return Number.isFinite(parsed) ? parsed : NaN;
    }

    return NaN;
};

export default function UpcomingEvents() {
    const containerRef = useRef<HTMLDivElement>(null);
    const events = useEventStore((state) => state.events);
    const fetchEvents = useEventStore((state) => state.fetchEvents);
    const fetchSchoolEvents = useEventStore((state) => state.fetchSchoolEvents);
    const getSchoolEvents = useEventStore((state) => state.getSchoolEvents);
    const schoolEventsById = useEventStore((state) => state.schoolEventsById);
    const isEventsLoading = useEventStore((state) => state.isLoading);
    const currentUser = useUserStore((state) => state.currentUser);
    const userRole = useUserStore((state) => state.userRole);
    const activeSchool = useSchoolStore((state) => state.activeSchool);

    const schoolId =
        (currentUser as any)?.school_id ||
        (currentUser as any)?.schoolId ||
        (currentUser as any)?.school?.school_id ||
        activeSchool?.school_id;
    const normalizedSchoolId = schoolId ? String(schoolId) : "";
    const isSchoolUser = userRole === "STUDENT" || userRole === "TEACHER" || userRole === "SCHOOL_ADMIN";

    // Hydrate school events from the same source used by the school profile Events tab.
    useEffect(() => {
        if (!isSchoolUser) return;
        if (!normalizedSchoolId) return;

        void fetchSchoolEvents(normalizedSchoolId, 1, 100);
    }, [
        isSchoolUser,
        normalizedSchoolId,
        fetchSchoolEvents,
    ]);

    // Keep baseline events hydrated for non-school roles.
    useEffect(() => {
        if (isSchoolUser) return;
        if (isEventsLoading) return;
        if (events.length >= 10) return;

        void fetchEvents(1, 20);
    }, [isSchoolUser, isEventsLoading, events.length, fetchEvents]);

    const upcomingEvents = useMemo(() => {
        const sourceEvents: Event[] = isSchoolUser && normalizedSchoolId
            ? (schoolEventsById[normalizedSchoolId] || getSchoolEvents(normalizedSchoolId))
            : events;

        const nowMs = Date.now();

        return sourceEvents
            .filter(event => {
                const startMs = parseEventTime(event.startDate);
                return Number.isFinite(startMs) && startMs > nowMs;
            })
            .sort((a, b) => parseEventTime(a.startDate) - parseEventTime(b.startDate))
            .slice(0, 3);
    }, [events, isSchoolUser, normalizedSchoolId, schoolEventsById, getSchoolEvents]);

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
                    upcomingEvents.map((event) => (
                        <Link
                            key={event._id}
                            href={`/events/${event._id}`}
                            className="event-item flex gap-4 p-3 rounded-xl hover:bg-[var(--gray-50)] transition-all cursor-pointer border border-transparent hover:border-[var(--gray-200)]"
                        >
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
                        </Link>
                    ))
                ) : (

                    <p className="text-sm text-[var(--text-muted)]">
                        {isSchoolUser ? "No upcoming events for your school yet." : "No upcoming events found."}
                    </p>
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
