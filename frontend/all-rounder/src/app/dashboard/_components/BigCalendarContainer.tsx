"use client";

import BigCalendar from "./BigCalender";
import { useEventStore } from "@/context/useEventStore";
import { useEffect } from "react";

interface BigCalendarContainerProps {
  schoolId?: string;
  organizerId?: string;
  type?: "School" | "Organization";
}

const BigCalendarContainer = ({
  schoolId,
  organizerId,
  type = "School"
}: BigCalendarContainerProps) => {
  const { events, fetchEvents, isLoading } = useEventStore();

  useEffect(() => {
    void fetchEvents(1, 100);
  }, [fetchEvents]);
  // Determine which ID to use
  const id = schoolId || organizerId;

  // Filter events based on type
  const filteredEvents = events.filter((event) => {
    if (!id) return false;
    const expectedHostType = type === "School" ? "school" : "organization";
    return (event.hosts || []).some(
      (host) => host.hostType === expectedHostType && host.hostId === id
    );
  });

  const data = filteredEvents.map((event) => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 60 * 60 * 1000);

    return {
      id: event._id || (event as any).id,
      title: event.title,
      start: startDate,
      end: endDate > startDate ? endDate : new Date(startDate.getTime() + 60 * 60 * 1000),
      timeLabel: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: event.location,
    };
  });

  // Dynamic title based on type
  const title = type === "School" ? "School Events" : "Organization Events";

  return (
    <div className="h-[700px] p-4 bg-white rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {isLoading && events.length === 0 ? (
        <div className="h-[600px] flex items-center justify-center text-gray-500">Loading events...</div>
      ) : (
      <BigCalendar data={data} />
      )}
    </div>
  );
};

export default BigCalendarContainer;