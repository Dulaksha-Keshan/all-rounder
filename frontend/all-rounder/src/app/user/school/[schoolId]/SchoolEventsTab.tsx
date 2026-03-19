
"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { useEventStore } from "@/context/useEventStore";

interface SchoolEventsTabProps {
  schoolId: string;
}

export default function SchoolEventsTab({ schoolId }: SchoolEventsTabProps) {
  const { events, isLoading, fetchEvents } = useEventStore();

  useEffect(() => {
    void fetchEvents(1, 100);
  }, [fetchEvents]);

  const schoolEvents = useMemo(() => {
    return events
      .filter((event) =>
        (event.hosts || []).some(
          (host) => host.hostType === "school" && host.hostId === schoolId
        )
      )
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  }, [events, schoolId]);

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
      <h2 className="text-xl font-bold text-[#34365C] mb-4">School Events</h2>

      {isLoading && schoolEvents.length === 0 ? (
        <p className="text-sm text-gray-500">Loading school events...</p>
      ) : schoolEvents.length === 0 ? (
        <p className="text-sm text-gray-500">No events found for this school yet.</p>
      ) : (
        <div className="space-y-3">
          {schoolEvents.map((event) => {
            const start = new Date(event.startDate);

            return (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className="block rounded-lg border border-[#DCD0FF]/70 bg-[#FAF9FF] p-4 hover:border-[var(--primary-blue)]/40 hover:bg-white transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#34365C] truncate">{event.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{event.description}</p>
                  </div>
                  <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] font-semibold">
                    {event.category}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {start.toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="w-3.5 h-3.5" />
                    {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


