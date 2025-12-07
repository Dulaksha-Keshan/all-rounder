import { EventCard } from "./EventCard";
import { Event } from "../_types/event";


export const EventList = ({ events }: { events: Event[] }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-[#8387CC]">
        <h3 className="text-2xl font-bold text-[#34365C] mb-2">No events found</h3>
        <p className="text-gray-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};