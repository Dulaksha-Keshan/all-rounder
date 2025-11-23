'use client';
import { Events } from './Features';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Calendar, Clock, MapPin } from 'lucide-react';

export function EventDetails() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration by only rendering random particles on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Events.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Character-by-character title animation
  useGSAP(() => {
    const titleText = titleRef.current;
    if (!titleText || !titleText.textContent) return;

    const chars = titleText.textContent.split('');
    titleText.innerHTML = chars.map(char => 
      `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    if (titleRef.current && titleRef.current.children) {
      gsap.from(titleRef.current.children, {
        yPercent: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.03,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    }
  }, []);

  // Slide transition animation
  useGSAP(() => {
    const tl = gsap.timeline();

    // Image entrance with 3D effect
    tl.fromTo('.event-image', 
      { 
        scale: 0.8,
        rotateY: direction > 0 ? 30 : -30,
        opacity: 0,
        filter: 'blur(10px)'
      }, 
      { 
        scale: 1,
        rotateY: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out'
      }
    );

    // Card container with slide effect
    tl.fromTo('.event-card-container',
      { 
        x: direction > 0 ? 100 : -100,
        opacity: 0,
        rotateY: direction > 0 ? 10 : -10
      },
      { 
        x: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.9,
        ease: 'power2.out'
      },
      '-=0.8'
    );

    // Event info with stagger
    tl.from('.event-info-item',
      {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      },
      '-=0.5'
    );

    // Button with bounce
    tl.fromTo('.event-button',
      { 
        scale: 0,
        rotation: -180,
        opacity: 0
      },
      { 
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      },
      '-=0.4'
    );

  }, [currentIndex]);

  const totalEvents = Events.length;

  const goToSlide = (index: number) => {
    const newIndex = (index + totalEvents) % totalEvents;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  };

  const currentEvent = Events[currentIndex];

  // Category color mapping
  const categoryColors: { [key: string]: string } = {
    Workshop: 'bg-blue-500',
    Competition: 'bg-red-500',
    Social: 'bg-green-500',
    Career: 'bg-purple-500',
  };

  return (
    <section className='bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 py-20 overflow-hidden'>
      <div ref={containerRef} className="max-w-7xl mx-auto px-4">
        {/* Animated Title */}
        <h2 
          ref={titleRef}
          className="text-5xl font-bold text-[#34365C] text-center mb-16 overflow-hidden"
        >
          Explore Our Events
        </h2>

        {/* Event Carousel */}
        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ perspective: '1000px' }}
        >
          {/* Left Arrow with hover effect */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-14 h-14 flex items-center justify-center text-5xl text-[#8387CC] hover:text-[#4169E1] z-20 transition-all duration-300 hover:scale-125 hover:-translate-x-20"
            onClick={() => goToSlide(currentIndex - 1)}
            aria-label="Previous event"
          >
            ‹
          </button>

          {/* Event Card with 3D effect */}
          <div className="event-card-container relative" style={{ transformStyle: 'preserve-3d' }}>
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-[#8387CC] overflow-hidden relative group transform transition-transform duration-300 hover:scale-[1.02]">
              {/* Image with parallax effect on hover */}
              <div className="overflow-hidden relative">
                <img 
                  src={currentEvent.image} 
                  alt={currentEvent.title}
                  className="event-image w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-6 right-6 event-info-item">
                  <span className={`${categoryColors[currentEvent.category] || 'bg-gray-500'} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                    {currentEvent.category}
                  </span>
                </div>

                {/* Event Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-4xl font-bold mb-2 event-info-item drop-shadow-lg">
                    {currentEvent.title}
                  </h3>
                  <p className="text-lg text-gray-200 event-info-item drop-shadow-md">
                    {currentEvent.description}
                  </p>
                </div>
                
                {/* Floating particles effect on hover */}
                {isMounted && (
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/40 rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: '3s'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Event Details Section */}
              <div className="p-8 bg-gradient-to-br from-white to-purple-50">
                <div className="grid grid-cols-3 gap-6 mb-6">
                  {/* Date */}
                  <div className="event-info-item text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-[#8387CC]" />
                    <div className="text-m text-gray-600 font-medium">Date</div>
                    <div className="text-[#34365C] font-bold">{currentEvent.date}</div>
                  </div>

                  {/* Time */}
                  <div className="event-info-item text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-[#8387CC]" />
                    <div className="text-m text-gray-600 font-medium">Time</div>
                    <div className="text-[#34365C] font-bold">{currentEvent.time}</div>
                  </div>

                  {/* Location */}
                  <div className="event-info-item text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-[#8387CC]" />
                    <div className="text-m text-gray-600 font-medium">Location</div>
                    <div className="text-[#34365C] font-bold">{currentEvent.location}</div>
                  </div>
                </div>

                {/* Find Out More Button with glow effect */}
                <div className="flex justify-center event-button">
                  <button className="relative px-10 py-4 bg-[#8387CC] text-white text-lg font-semibold rounded-xl hover:bg-[#4169E1] shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white/20 overflow-hidden group/btn">
                    <span className="relative z-10">Find Out More</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-14 h-14 flex items-center justify-center text-5xl text-[#8387CC] hover:text-[#4169E1] z-20 transition-all duration-300 hover:scale-125 hover:translate-x-20"
            onClick={() => goToSlide(currentIndex + 1)}
            aria-label="Next event"
          >
            ›
          </button>
        </div>

        {/* Animated Carousel Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {Events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? 'bg-[#8387CC] w-12 shadow-lg shadow-[#8387CC]/50' 
                  : 'bg-[#DCD0FF] hover:bg-[#8387CC] w-3 hover:w-6'
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Info with animation */}
        <div className="text-center mt-6 text-[#34365C] font-bold text-lg">
          <span className="inline-block transition-transform duration-300 hover:scale-110">
            {currentIndex + 1} / {totalEvents}
          </span>
        </div>
      </div>
    </section>
  );
}