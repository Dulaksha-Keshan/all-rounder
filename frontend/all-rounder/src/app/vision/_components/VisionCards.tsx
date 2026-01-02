'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Palette, Users, Trophy } from 'lucide-react';

export default function VisionCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.vision-card', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power1.out',
      });
    }, containerRef);

    return () => ctx.revert(); // cleanup on route change
  }, []);

  return (
    <section
      ref={containerRef}
      className="max-w-5xl mx-auto space-y-6"
    >
      {[
        {
          title: (
            <div className="flex items-center justify-center gap-3">
              <Palette className="w-8 h-8 text-white bg-gradient-to-br from-[#8387CC] to-[#4169E1] p-2 rounded-xl" />
              <span>Create</span>
            </div>
          ),
          text: 'Build a comprehensive digital portfolio that captures every facet of your student journey. From achievements to creative projects and leadership all in one powerful profile.',
          tags: ['BUILD', 'SHOWCASE'],
        },
        {
          title: (
            <div className="flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-white bg-gradient-to-br from-[#8387CC] to-[#4169E1] p-2 rounded-xl" />
              <span>Contribute</span>
            </div>
          ),
          text: 'Share your voice and experiences with a vibrant community. Engage meaningfully through our social feed, support peers, and contribute to a collaborative environment.',
          tags: ['CONNECT', 'ENGAGE'],
        },
        {
          title: (
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-white bg-gradient-to-br from-[#8387CC] to-[#4169E1] p-2 rounded-xl" />
              <span>Celebrate</span>
            </div>
          ),
          text: 'Recognize and honor your milestones. Get verified recognition from educators, climb leaderboards, and receive the acknowledgment you deserve for your hard work and dedication.',
          tags: ['ACHIEVE', 'RECOGNIZE'],
        },
      ].map((item, i) => (
        <div
          key={i}
          className="vision-card bg-[#F3EEFF] border border-[#8387CC]/40 rounded-2xl px-8 py-6 shadow-md text-center flex flex-col items-center"
        >
          <h3 className="text-2xl font-bold text-[#34365C] mb-4">
            {item.title}
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4 text-[18px] text-center">
            {item.text}
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
