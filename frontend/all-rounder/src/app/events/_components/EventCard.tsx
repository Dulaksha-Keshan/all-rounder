import { Event } from '@/app/_type/type';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

import NextImage from 'next/image';

export const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="bg-[var(--white)] rounded-2xl overflow-hidden shadow-xl shadow-[#DCD0FF]/25 border border-[#DCD0FF]/50 hover:border-[#8387CC] transition-all duration-500 hover:shadow-2xl hover:shadow-[#8387CC]/20 group">
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden bg-[#F8F8FF]">
          <NextImage
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Status Badge */}
          {event.status === "Registered" && (
            <div className="absolute top-4 left-4 px-4 py-1.5 bg-green-500 text-[var(--white)] rounded-full text-xs font-bold shadow-lg backdrop-blur-md bg-green-500/80 border border-white/20">
              ✓ ENROLLED
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <span className="text-white text-xs font-medium px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg">
              {event.location}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-7 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="flex gap-2">
              {event.categories?.slice(0, 2).map((cat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[var(--secondary-light-lavender)]/20 text-[var(--primary-purple)] text-[10px] rounded-lg font-bold tracking-wider uppercase"
                >
                  {cat}
                </span>
              ))}
            </div>
            <span className="text-[var(--primary-blue)] font-bold text-xs bg-[var(--primary-blue)]/10 px-2.5 py-1 rounded-lg">
              {event.status}
            </span>
          </div>

          <h3 className="text-2xl font-black text-[var(--text-main)] mb-3 leading-tight group-hover:text-[var(--primary-purple)] transition-colors">
            {event.title}
          </h3>

          <p className="text-[var(--text-muted)] text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
            {event.description}
          </p>

          {/* Event Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 mt-auto py-4 border-y border-[var(--secondary-light-lavender)]/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--secondary-light-lavender)]/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[var(--primary-purple)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Date</span>
                <span className="text-xs font-bold text-[var(--text-main)]">{event.date}</span>
              </div>
            </div>

            {event.deadline && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0F0] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Deadline</span>
                  <span className="text-xs font-bold text-red-500">{event.deadline}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/events/${event.id}`}
              className="flex-1 px-4 py-3 bg-[#F8F8FF] text-[#34365C] rounded-xl hover:bg-[#F0EEFF] transition-all font-bold text-sm text-center border border-[#DCD0FF]/50"
            >
              View More
            </Link>
            {event.status === "Registered" ? (
              <button className="flex-1 px-4 py-3 bg-green-50 text-green-600 rounded-xl font-bold text-sm cursor-not-allowed border border-green-100" disabled>
                Registered ✓
              </button>
            ) : (
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-blue)] text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all font-bold text-sm">
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}