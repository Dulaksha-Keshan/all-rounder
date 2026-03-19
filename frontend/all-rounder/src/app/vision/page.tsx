'use client';

import MeetOurTeam from './_components/MeetOurTeam';
import VisionHero from './_components/VisionHero';
import VisionCards from './_components/VisionCards';
import AboutAllRounder from './_components/AboutAllRounder';
import AnimatedAvatarBackground from '@/components/AnimatedAvatarBackground';


export default function VisionPage() {
  return (
    <div className="relative overflow-hidden">
      <AnimatedAvatarBackground intensity="soft" className="opacity-90" />

      <div className="relative z-10">
        {/* HERO */}
        <VisionHero />

        {/* VISION CARDS */}
        <section className="bg-gray-100/95 px-6 py-20">
          <VisionCards />
        </section>

        {/* ABOUT ALL-ROUNDER */}
        <section>
          <AboutAllRounder />
        </section>

        {/* MEET OUR TEAM */}
        <section className="max-w-6xl mx-auto mt-10">
          <MeetOurTeam />
        </section>
      </div>
    </div>
  );
}
