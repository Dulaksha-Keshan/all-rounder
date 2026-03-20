'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Trophy, Book, GraduationCap, Heart, Palette } from 'lucide-react';

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // Animate floating achievement icons
      iconsRef.current.forEach((icon, i) => {
        if (icon) {
          gsap.to(icon, {
            y: 'random(-40, 40)',
            x: 'random(-40, 40)',
            rotation: 'random(-15, 15)',
            duration: 4 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.5
          });
        }
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:py-20 overflow-hidden">

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Text Content */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 z-10 relative px-4">
          <h1 ref={headingRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 text-[var(--primary-dark-purple)]">
            Show the full story of{' '}
            <span ref={subheadingRef} className="inline-block relative text-[var(--primary-blue)]">
              who you are
              <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" height="8" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 5 100 2 150 3C200 4 250 7 298 10" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 text-[var(--primary-purple)]">beyond grades</h1>

          <p ref={descriptionRef} className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 text-[var(--text-muted)] opacity-95 px-4">
            Your journey deserves to be seen. Build a profile that transforms your achievements, passions, and experiences into a powerful first impression.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">
            <Link href="/signUp">
              <button className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-0.5 bg-[var(--primary-blue)] text-[var(--secondary-pale-lavender)] hover:bg-purple-200">
                <span className="flex items-center justify-center gap-3">Join Us Today</span>
              </button>
            </Link>

            <Link href="/help">
              <button className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-2xl font-bold text-base sm:text-lg border-2 border-[var(--primary-blue)] bg-white/20 text-[var(--primary-dark-purple)] transition-all transform hover:scale-105 hover:-translate-y-0.5 hover:bg-white/40 hover:text-[var(--primary-blue)]">
                <span className="flex items-center justify-center gap-3">Learn More</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Laptop Frame with Avatar */}
        <div className="relative max-w-4xl mx-auto px-4" ref={laptopRef}>
          {/* Laptop Frame */}
          <div className="relative z-10">
            {/* Screen Border with Glow */}
            <div className="relative rounded-xl sm:rounded-2xl p-0.5 sm:p-1 shadow-xl sm:shadow-2xl" style={{ background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-blue) 100%)' }}>
              {/* Screen */}
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-[var(--dark-bg)]">
                {/* Screen Content with Avatar and Leaderboard */}
                <div className="relative aspect-[16/9] flex items-center justify-center bg-[var(--secondary-purple-light)]">
                  {/* Left side - Leaderboard Image */}
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 p-2 sm:p-4">
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/Landing/leaderboard.png"
                        alt="Leaderboard"
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 600px"
                        className="object-cover rounded-lg"
                        priority
                      />
                    </div>
                  </div>

                  {/* Right side - Avatar moving around */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center">

                    {/* Floating Achievement Icons */}
                    <div ref={(el) => { iconsRef.current[0] = el; }} className="absolute top-[20%] right-[25%] text-[var(--primary-blue)] opacity-40 blur-[0.5px]">
                      <Star size={24} fill="currentColor" />
                    </div>
                    <div ref={(el) => { iconsRef.current[1] = el; }} className="absolute bottom-[20%] left-[20%] text-[var(--primary-purple)] opacity-40 blur-[0.5px]">
                      <Trophy size={28} />
                    </div>
                    <div ref={(el) => { iconsRef.current[2] = el; }} className="absolute top-[55%] right-[15%] text-[var(--secondary-light-lavender)] opacity-40 blur-[0.5px]">
                      <Book size={20} />
                    </div>
                    <div ref={(el) => { iconsRef.current[3] = el; }} className="absolute top-[35%] left-[25%] text-[var(--primary-blue)] opacity-30 blur-[0.5px]">
                      <GraduationCap size={22} />
                    </div>
                    <div ref={(el) => { iconsRef.current[4] = el; }} className="absolute bottom-[40%] right-[20%] text-pink-400 opacity-30 blur-[0.5px]">
                      <Heart size={18} fill="currentColor" />
                    </div>
                    <div ref={(el) => { iconsRef.current[5] = el; }} className="absolute top-[70%] left-[30%] text-orange-400 opacity-30 blur-[0.5px]">
                      <Palette size={20} />
                    </div>

                    <div ref={avatarRef} className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 z-10">
                      <Image
                        src="/icons/Avatar.png"
                        alt="Student Avatar"
                        fill
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
                        className="object-contain drop-shadow-2xl"
                        priority
                      />

                      {/* Glow effect around avatar */}
                      <div className="absolute inset-0 rounded-full blur-xl sm:blur-2xl opacity-30 -z-10 bg-[var(--primary-purple)]"></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Laptop Base */}
            <div className="relative h-2 sm:h-3 lg:h-4 mx-auto" style={{ width: '110%' }}>
              <div className="absolute inset-0 rounded-b-2xl sm:rounded-b-3xl" style={{ background: 'linear-gradient(to bottom, var(--primary-purple) 0%, var(--primary-dark-purple) 100%)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
