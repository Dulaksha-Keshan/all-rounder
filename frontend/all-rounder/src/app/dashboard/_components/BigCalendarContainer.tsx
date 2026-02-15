"use client";

import BigCalendar from "./BigCalender";
import { useEventStore } from "@/context/useEventStore";

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
  const { events } = useEventStore();
  // Determine which ID to use
  const id = schoolId || organizerId;

  // Filter events based on type
  const filteredEvents = events.filter((event) => {
    if (!id) return false;
    // Map props type to host type (lowercase)
    const targetHostType = type === "School" ? "school" : "organization";
    // Check hosts array
    return event.hosts?.some(h => h.hostId === id && h.hostType === targetHostType);
  });

  const data = filteredEvents.map((event) => ({
    title: event.title,
    start: new Date(event.startDate),
    end: new Date(event.endDate || event.startDate),
    time: event.time || new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: event.location,
  }));

  // Dynamic title based on type
  const title = type === "School" ? "School Events" : "Organization Events";

  return (
    <div className="h-[700px] p-4 bg-white rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <BigCalendar data={data} />
    </div>
  );
};

export default BigCalendarContainer;