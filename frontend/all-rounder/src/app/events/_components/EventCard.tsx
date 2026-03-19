"use client";

import { Calendar, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import { Event } from '@/app/_type/type';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: index * 0.1, ease: "power2.out" }
    );
  }, [index]);

  // Derive image URL from attachments or use fallback
  const getImageUrl = () => {
    if (event.attachments && event.attachments.length > 0) {
      return event.attachments[0];
    }
    return '/images/hero-1.jpg';
  };

  // Format start date and time
  const getEventTime = () => {
    const date = new Date(event.startDate);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div ref={cardRef} className="bg-[var(--white)] rounded-2xl overflow-hidden shadow-xl shadow-[#DCD0FF]/25 border border-[#DCD0FF]/50 hover:border-[#8387CC] transition-all duration-500 hover:shadow-2xl hover:shadow-[#8387CC]/20 group opacity-0">
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden bg-[#F8F8FF]">
          <Image
            src={getImageUrl()}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Content Section */}
        <div className="flex-grow p-6 md:p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[var(--secondary-pale-lavender)] text-[var(--primary-purple)] text-xs font-bold rounded-lg border border-[var(--secondary-light-lavender)]">
                {event.category || 'Event'}
              </span>
              <div className="flex items-center gap-1.5 text-[var(--gray-400)] text-xs font-medium">
                <Clock size={14} />
                <span>{getEventTime()}</span>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-[var(--primary-dark-purple)] mb-3 group-hover:text-[var(--primary-blue)] transition-colors">
              {event.title}
            </h3>

            <p className="text-[var(--gray-600)] text-sm md:text-base leading-relaxed mb-6 line-clamp-2">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-[var(--gray-600)]">
                <div className="p-2 bg-[var(--gray-50)] rounded-lg text-[var(--primary-purple)]">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--gray-400)] uppercase font-bold tracking-wider">Date</p>
                  <p className="text-sm font-semibold">{new Date(event.startDate).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[var(--gray-600)]">
                <div className="p-2 bg-[var(--gray-50)] rounded-lg text-[var(--primary-blue)]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--gray-400)] uppercase font-bold tracking-wider">Location</p>
                  <p className="text-sm font-semibold truncate">{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center pt-6 border-t border-[var(--gray-100)]">
            <Link href={`/events/${event._id}`} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-blue)] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}