'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Sparkles, Users, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const spotlightCards = [
  {
    title: 'Live School Challenges',
    description:
      'Join weekly challenge drops curated by schools and mentors. Build consistency through short sprints and public progress.',
    icon: Trophy,
    badge: 'Weekly',
    accent: 'from-[#8387CC] to-[#4169E1]',
  },
  {
    title: 'Peer Collaboration Rooms',
    description:
      'Match with peers based on goals and skills, then work together on projects, prep, and portfolio outcomes.',
    icon: Users,
    badge: 'Collaborative',
    accent: 'from-[#6B73C8] to-[#34365C]',
  },
  {
    title: 'Milestone Timelines',
    description:
      'Track your growth in one place with visual milestones and guidance prompts to keep momentum strong.',
    icon: Calendar,
    badge: 'Structured',
    accent: 'from-[#9A8EEA] to-[#6B73C8]',
  },
];

export function OpportunitySpotlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heading = headingRef.current;
      const cards = cardsRef.current?.querySelectorAll('.spotlight-card') || [];
      const glow = sectionRef.current?.querySelector('.spotlight-glow');

      if (!heading || cards.length === 0) return;

      gsap.fromTo(
        heading,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        cards,
        { y: 50, opacity: 0, rotateX: -8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 82%',
          },
        }
      );

      if (glow) {
        gsap.to(glow, {
          xPercent: 30,
          yPercent: 10,
          repeat: -1,
          yoyo: true,
          duration: 5,
          ease: 'sine.inOut',
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-14 sm:py-16 lg:py-20 bg-gradient-to-br from-[#F5F2FF] via-[#FFFFFF] to-[#EEF2FF]"
    >
      <div className="spotlight-glow absolute -top-20 -right-20 w-72 h-72 bg-[#BDB4FF]/30 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={headingRef} className="text-center mb-10 sm:mb-12 opacity-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E2FF] text-[#4A4F8F] text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Explore The Platform
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#34365C] tracking-tight mb-3">
            Your Next Opportunity Starts Here
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#5C5F8A] max-w-3xl mx-auto leading-relaxed">
            Even before signing in, you can discover how All-Rounder helps students build momentum, collaborate deeply, and celebrate real growth.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" style={{ perspective: '1000px' }}>
          {spotlightCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="spotlight-card opacity-0 group rounded-3xl border border-[#DDD9FF] bg-white/80 backdrop-blur-sm p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.accent} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#5D6093] bg-[#EEF0FF] px-3 py-1 rounded-full">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#34365C] mb-2">{card.title}</h3>
                <p className="text-sm sm:text-base text-[#60638E] leading-relaxed">{card.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-transform hover:scale-[1.03]"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
