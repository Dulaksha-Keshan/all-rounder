import BigCalendar from "./BigCalender";
import { Events } from "@/app/events/_data/events";

interface BigCalendarContainerProps {
  schoolId?: string;
  organizerId?: string;
  type?: "School" | "Organization";
}

const BigCalendarContainer = async ({ 
  schoolId, 
  organizerId, 
  type = "School" 
}: BigCalendarContainerProps) => {
  // Determine which ID to use
  const id = schoolId || organizerId;
  
  // Filter events based on type
  const filteredEvents = Events.filter((event) => {
    if (!id) return false;
    return event.organizerId === id && event.organizerType === type;
  });

  const data = filteredEvents.map((event) => ({
    title: event.title,
    start: new Date(event.date),
    end: new Date(event.date),
    time: event.time,
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