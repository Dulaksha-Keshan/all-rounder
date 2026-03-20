// 'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

export default function VisionHero() {

  useEffect(() => {
    // Blinking animation
    gsap.to('.blink-star', {
      opacity: 0.2,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        each: 0.4,
        from: "random"
      }
    });

    // Floating animation
    gsap.to('.float-star', {
      y: -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.5,
        from: "random"
      }
    });

  }, []);

  return (
    <section className="relative w-full bg-[#34365C]/78 backdrop-blur-[1px] text-white py-20 overflow-hidden">

      {/* Animated Stars */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="blink-star float-star absolute top-16 left-20 text-4xl text-[#DCD0FF]">
          ✦
        </div>

        <div className="blink-star absolute top-32 right-32 text-5xl text-[#AAB4FF]">
          ★
        </div>

        <div className="blink-star float-star absolute bottom-20 left-1/3 text-3xl text-[#DCD0FF]">
          ✦
        </div>

        <div className="blink-star absolute bottom-24 right-24 text-4xl text-[#AAB4FF]">
          ★
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
      
        <h1 className="text-4xl md:text-6xl font-bold mb-3 ">
          Our Vision & <span className="text-[#4169E1]">Mission</span>
        </h1>

        <p className="max-w-3xl text-xl text-[#DCD0FF] opacity-90">
          Empowering students to showcase their unique journey through three core pillars that define our platform.
        </p>
      </div>
    </section>
  );
}
