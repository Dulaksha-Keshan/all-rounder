import { EventCard } from "./EventCard";
import { Event } from "../_types/event";

export const EventList = ({ events }: { events: Event[] }) => {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-100">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-[#34365C] mb-2">No events found</h3>
        <p className="text-gray-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};