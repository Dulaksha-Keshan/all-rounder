'use client';
import { Events } from './Features';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function EventDetails() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Events.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  useGSAP(() => {
    // Animate title
    gsap.fromTo('#events-title', 
      { opacity: 0, y: -30 }, 
      { opacity: 1, y: 0, duration: 1 }
    );

    // Animate event image
    gsap.fromTo('.event-image', 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
    );

    // Animate card container
    gsap.fromTo('.event-card-container',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power1.out' }
    );

    // Animate button
    gsap.fromTo('.event-button',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' }
    );

  }, [currentIndex]);

  const totalEvents = Events.length;

  const goToSlide = (index: number) => {
    const newIndex = (index + totalEvents) % totalEvents;
    setCurrentIndex(newIndex);
  };

  const getEventAt = (indexOffset: number) => {
    return Events[(currentIndex + indexOffset + totalEvents) % totalEvents];
  };

  const currentEvent = getEventAt(0);

  return (
    <div ref={containerRef} className="mb-16">
      <h2 
        id="events-title" 
        className="text-4xl font-bold text-[#34365C] text-center mb-12"
      >
        Explore Our Events
      </h2>

      {/* Event Carousel */}
      <div 
        className="relative max-w-5xl mx-auto event-card-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Arrow */}
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 flex items-center justify-center text-4xl text-[#8387CC] hover:text-[#4169E1] z-10 transition-colors"
          onClick={() => goToSlide(currentIndex - 1)}
          aria-label="Previous event"
        >
          ‹
        </button>

        {/* Event Card - No padding, no gap */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-[#8387CC] overflow-hidden relative group">
          <img 
            src={currentEvent.image} 
            alt={`Event ${currentEvent.id}`}
            className="event-image w-full h-[500px] object-cover"
          />
          
          {/* Overlay gradient for better button visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Find Out More Button */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 event-button">
            <button className="px-10 py-4 bg-[#8387CC] text-white text-lg font-semibold rounded-xl hover:bg-[#4169E1] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#8387CC]/50 border-2 border-white/20">
              Find Out More
            </button>
          </div>
        </div>

        {/* Right Arrow */}
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 flex items-center justify-center text-4xl text-[#8387CC] hover:text-[#4169E1] z-10 transition-colors"
          onClick={() => goToSlide(currentIndex + 1)}
          aria-label="Next event"
        >
          ›
        </button>
      </div>

      {/* Carousel Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {Events.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#8387CC] w-8' 
                : 'bg-[#DCD0FF] hover:bg-[#8387CC] w-3'
            }`}
            aria-label={`Go to event ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Info */}
      <div className="text-center mt-4 text-[#34365C] font-medium">
        {currentIndex + 1} / {totalEvents}
      </div>
    </div>
  );
}