'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function HeroSection() {
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const laptopRef = useRef(null);
  const avatarRef = useRef(null);
  const starsRef = useRef([]);

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
        }, '-=0.4')
        .from(buttonsRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
        }, '-=0.3');

      // Laptop animation
      gsap.from(laptopRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5,
      });

      // Avatar moving around everywhere inside laptop
      gsap.to(avatarRef.current, {
        x: 60,
        y: -40,
        duration: 3,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.to(avatarRef.current, {
            x: -50,
            y: 30,
            duration: 3.5,
            ease: 'power1.inOut',
            onComplete: () => {
              gsap.to(avatarRef.current, {
                x: 40,
                y: -20,
                duration: 3,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true,
              });
            },
          });
        },
      });

      // Rotate avatar as it moves
      gsap.to(avatarRef.current, {
        rotation: 360,
        duration: 8,
        ease: 'none',
        repeat: -1,
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
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden" style={{ backgroundColor: '#34365C' }}>
      {/* Decorative Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={(el) => (starsRef.current[0] = el)}
          className="absolute top-20 left-10 text-5xl"
          style={{ color: '#DCD0FF' }}
        >
          ✦
        </div>
        <div
          ref={(el) => (starsRef.current[1] = el)}
          className="absolute top-32 right-20 text-4xl"
          style={{ color: '#8387CC' }}
        >
          ★
        </div>
        <div
          ref={(el) => (starsRef.current[2] = el)}
          className="absolute bottom-32 left-32 text-6xl"
          style={{ color: '#DCD0FF' }}
        >
          ✦
        </div>
        <div
          ref={(el) => (starsRef.current[3] = el)}
          className="absolute top-1/3 right-32 text-5xl"
          style={{ color: '#8387CC' }}
        >
          ★
        </div>
        <div
          ref={(el) => (starsRef.current[4] = el)}
          className="absolute bottom-20 right-12 text-4xl"
          style={{ color: '#DCD0FF' }}
        >
          ✦
        </div>
        <div
          ref={(el) => (starsRef.current[5] = el)}
          className="absolute top-1/2 left-20 text-3xl"
          style={{ color: '#8387CC' }}
        >
          ★
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Text Content */}
        <div className="text-center mb-16 z-10 relative">
          <h1
            ref={headingRef}
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{ color: '#F8F8FF' }}
          >
            Show the full story of{' '}
            <span
              ref={subheadingRef}
              className="inline-block relative"
              style={{ color: '#4169E1' }}
            >
              who you are
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 5 100 2 150 3C200 4 250 7 298 10"
                  stroke="#4169E1"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <h1
            className="text-5xl md:text-7xl font-bold mb-8"
            style={{ color: '#DCD0FF' }}
          >
            beyond grades
          </h1>

          <p
            ref={descriptionRef}
            className="text-xl max-w-3xl mx-auto mb-10"
            style={{ color: '#F8F8FF', opacity: 0.9 }}
          >
            Your journey deserves to be seen. Build a profile that transforms your achievements, passions, and experiences into a powerful first impression.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center">
            <button
              className="px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 hover:translate-y-[-2px]"
              style={{ backgroundColor: '#4169E1', color: '#F8F8FF' }}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                Join Us Today
              </span>
            </button>
            <button
              className="px-10 py-5 rounded-2xl font-bold text-lg border-2 transition-all transform hover:scale-105 hover:translate-y-[-2px]"
              style={{
                backgroundColor: 'transparent',
                borderColor: '#DCD0FF',
                color: '#DCD0FF',
              }}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                Learn More
              </span>
            </button>
          </div>
        </div>

        {/* Laptop Frame with Avatar Inside */}
        <div className="relative max-w-4xl mx-auto" ref={laptopRef}>
          {/* Laptop Frame */}
          <div className="relative z-10">
            {/* Screen Border with Glow */}
            <div
              className="relative rounded-2xl p-1 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #8387CC 0%, #4169E1 100%)',
              }}
            >
              {/* Screen */}
              <div
                className="relative rounded-xl overflow-hidden"
                style={{ backgroundColor: '#1a1a2e' }}
              >
                {/* Camera Notch */}
                <div className="h-5 flex items-center justify-center" style={{ backgroundColor: '#0f0f1e' }}>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#4169E1' }}
                  ></div>
                </div>

                {/* Screen Content with Avatar and Leaderboard */}
                <div className="relative aspect-[16/9] flex items-center justify-center" style={{ backgroundColor: '#CEB0E8' }}>
                  {/* Left side - Leaderboard Image */}
                  <div className="absolute left-0 top-0 bottom-0 w-150 flex items-center justify-center p-4">
                    {/* <div className="w-full h-full rounded-xl overflow-hidden shadow-lg"> */}
                      <img
                        src="/images/leaderboard.png"
                        alt="Leaderboard"
                        className="w-full h-full object-cover"
                      />
                    {/* </div> */}
                  </div>

                  {/* Right side - Avatar moving around */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center">
                    <div ref={avatarRef} className="relative">
                      <img
                        src="avatar.png"
                        alt="Student Avatar"
                        className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
                      />
                      {/* Glow effect around avatar */}
                      <div
                        className="absolute inset-0 rounded-full blur-2xl opacity-30 -z-10"
                        style={{ backgroundColor: '#8387CC' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop Base */}
            <div className="relative h-4 mx-auto" style={{ width: '110%' }}>
              <div
                className="absolute inset-0 rounded-b-3xl"
                style={{
                  background: 'linear-gradient(to bottom, #8387CC 0%, #34365C 100%)',
                }}
              ></div>
              {/* Keyboard indicator */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full" style={{ backgroundColor: '#34365C' }}></div>
            </div>
          </div>

          {/* Background glow */}
          <div
            className="absolute inset-0 rounded-3xl blur-3xl opacity-20 -z-10"
            style={{ backgroundColor: '#4169E1' }}
          ></div>
        </div>
      </div>
    </section>
  );
}


