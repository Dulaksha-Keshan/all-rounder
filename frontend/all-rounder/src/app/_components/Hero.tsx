
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for text animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
      })
        .from(subheadingRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
        }, '-=0.5')
        .from(descriptionRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
        }, '-=0.4');

      // Laptop animation
      gsap.from(laptopRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5,
      });

      // Avatar moving in a star pattern
      const starPath = [
        { x: 0, y: -60 },      // Top point
        { x: 40, y: 20 },      // Bottom right
        { x: -50, y: -20 },    // Left
        { x: 50, y: -20 },     // Right
        { x: -40, y: 20 },     // Bottom left
        { x: 0, y: -60 }       // Back to top
      ];

      const starTimeline = gsap.timeline({ repeat: -1 });
      
      starPath.forEach((point, index) => {
        starTimeline.to(avatarRef.current, {
          x: point.x,
          y: point.y,
          duration: 1.5,
          ease: 'power1.inOut',
        });
      });

      // Stars animation
      starsRef.current.forEach((star, i) => {
        gsap.from(star, {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          delay: 1 + i * 0.2,
          ease: 'back.out(2)',
        });

        // Continuous twinkling
        gsap.to(star, {
          scale: 1.5,
          opacity: 0.5,
          duration: 2,
          delay: 2 + i * 0.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden bg-[#34365C]">
      {/* Decorative Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div ref={(el) => { starsRef.current[0] = el; }} className="absolute top-20 left-10 text-5xl text-[#DCD0FF]">✦</div>
        <div ref={(el) => { starsRef.current[1] = el; }} className="absolute top-32 right-20 text-4xl text-[#8387CC]">★</div>
        <div ref={(el) => { starsRef.current[2] = el; }} className="absolute bottom-32 left-32 text-6xl text-[#DCD0FF]">✦</div>
        <div ref={(el) => { starsRef.current[3] = el; }} className="absolute top-1/3 right-32 text-5xl text-[#8387CC]">★</div>
        <div ref={(el) => { starsRef.current[4] = el; }} className="absolute bottom-20 right-12 text-4xl text-[#DCD0FF]">✦</div>
        <div ref={(el) => { starsRef.current[5] = el; }} className="absolute top-1/2 left-20 text-3xl text-[#8387CC]">★</div>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Text Content */}
        <div className="text-center mb-16 z-10 relative">
          <h1 ref={headingRef} className="text-5xl md:text-7xl font-bold mb-4 text-[#F8F8FF]">
            Show the full story of{' '}
            <span ref={subheadingRef} className="inline-block relative text-[#4169E1]">
              who you are
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 5 100 2 150 3C200 4 250 7 298 10" stroke="#4169E1" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[#DCD0FF]">beyond grades</h1>

          <p ref={descriptionRef} className="text-xl max-w-3xl mx-auto mb-10 text-[#F8F8FF] opacity-90">
            Your journey deserves to be seen. Build a profile that transforms your achievements, passions, and experiences into a powerful first impression.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center">
            <button className="px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-0.5 bg-[#4169E1] text-[#F8F8FF] hover:bg-purple-200">
              <span className="flex items-center gap-3">Join Us Today</span>
            </button>
            <button className="px-10 py-5 rounded-2xl font-bold text-lg border-2 border-[#DCD0FF] bg-transparent text-[#DCD0FF] transition-all transform hover:scale-105 hover:-translate-y-0.5 hover:bg-purple-200 hover:text-black">
              <span className="flex items-center gap-3">Learn More</span>
            </button>
          </div>
        </div>

        {/* Laptop Frame with Avatar Inside */}
        <div className="relative max-w-4xl mx-auto" ref={laptopRef}>
          {/* Laptop Frame */}
          <div className="relative z-10">
            {/* Screen Border with Glow */}
            <div className="relative rounded-2xl p-1 shadow-2xl" style={{ background: 'linear-gradient(135deg, #8387CC 0%, #4169E1 100%)' }}>
              {/* Screen */}
              <div className="relative rounded-xl overflow-hidden bg-[#1a1a2e]">
                {/* Screen Content with Avatar and Leaderboard */}
                <div className="relative aspect-[16/9] flex items-center justify-center bg-[#CEB0E8]">
                  {/* Left side - Leaderboard Image */}
                  <div className="absolute left-0 top-0 bottom-0 w-150 flex items-center justify-center p-4">
                    <img src="/images/leaderboard.png" alt="Leaderboard" className="w-full h-full object-cover" />
                  </div>

                  {/* Right side - Avatar moving around */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center">
                    <div ref={avatarRef} className="relative">
                      <img src="avatar.png" alt="Student Avatar" className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl" />
                      {/* Glow effect around avatar */}
                      <div className="absolute inset-0 rounded-full blur-2xl opacity-30 -z-10 bg-[#8387CC]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop Base */}
            <div className="relative h-4 mx-auto" style={{ width: '110%' }}>
              <div className="absolute inset-0 rounded-b-3xl" style={{ background: 'linear-gradient(to bottom, #8387CC 0%, #34365C 100%)' }}></div>
              {/* Keyboard indicator */}
              {/* <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full bg-[#34365C]"></div> */}
            </div>
          </div>

      
        </div>
      </div>
    </section>
  );
}