import { Event } from '@/app/_type/type';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="bg-[var(--white)] rounded-2xl overflow-hidden shadow-sm border-2 border-[var(--gray-100)] hover:border-[var(--primary-purple)] transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-56 md:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-[var(--secondary-light-lavender)] to-[var(--secondary-pale-lavender)]">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
    
          {/* Status Badge */}
          {event.status === "Registered" && (
            <div className="absolute top-4 right-4 px-4 py-2 bg-[var(--green-500)] text-[var(--white)] rounded-full text-sm font-semibold shadow-lg">
              ✓ Registered
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            {/* Title */}
            <h3 className="text-2xl font-bold text-[var(--primary-dark-purple)] mb-3 leading-tight">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-[var(--gray-600)] text-sm mb-4 line-clamp-2 leading-relaxed">
              {event.description}
            </p>

            {/* Categories */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {event.categories?.slice(0, 4).map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-[var(--secondary-light-lavender)] text-[var(--accent-purple-text)] text-xs rounded-full font-medium"
                >
                  {cat}
                </span>
              ))}
              {event.categories && event.categories.length > 4 && (
                <span className="px-3 py-1.5 bg-[var(--gray-100)] text-[var(--gray-600)] text-xs rounded-full font-medium">
                  +{event.categories.length - 4} more
                </span>
              )}
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 border-t border-[var(--gray-100)] pt-4">
              <div className="flex items-center gap-3 text-sm text-[var(--gray-700)]">
                <Calendar className="w-4 h-4 text-[var(--primary-purple)] flex-shrink-0" />
                <div>
                  <span className="font-medium">Event Date: </span>
                  <span>{event.date}</span>
                </div>
              </div>
              
              {event.deadline && (
                <div className="flex items-center gap-3 text-sm text-[var(--gray-700)]">
                  <Clock className="w-4 h-4 text-[var(--primary-purple)] flex-shrink-0" />
                  <div>
                    <span className="font-medium">Deadline: </span>
                    <span>{event.deadline}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-sm text-[var(--gray-700)] md:col-span-2">
                <MapPin className="w-4 h-4 text-[var(--primary-purple)] flex-shrink-0" />
                <div>
                  <span className="font-medium">Location: </span>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              <Link 
                href={`/events/${event.id}`}
                className="px-6 py-2.5 bg-[var(--gray-100)] text-[var(--gray-700)] rounded-lg hover:bg-[var(--gray-200)] transition-colors font-medium text-sm text-center"
              >
                View Details
              </Link>
              {event.status === "Registered" ? (
                <button className="px-6 py-2.5 bg-green-100 text-green-700 rounded-lg font-medium text-sm cursor-not-allowed" disabled>
                  Registered ✓
                </button>
              ) : (
                <button className="px-6 py-2.5 bg-[var(--primary-purple)] text-[var(--white)] rounded-lg hover:bg-[var(--primary-blue)] transition-colors font-medium text-sm">
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}