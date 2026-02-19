import { EventCard } from "./EventCard";
import { Event } from "@/app/_type/type";

export const EventList = ({ events }: { events: Event[] }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-[var(--white)] rounded-2xl shadow-lg border-2 border-[var(--primary-purple)]">
        <h3 className="text-2xl font-bold text-[var(--primary-dark-purple)] mb-2">No events found</h3>
        <p className="text-[var(--gray-600)]">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <EventCard key={event._id || index} event={event} />
      ))}
    </div>
  );
};