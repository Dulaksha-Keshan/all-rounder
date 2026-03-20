"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SchoolOverviewStatsSkeleton() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".stat-skeleton-card");

    gsap.fromTo(
      cards,
      { y: 14, opacity: 0.45 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="stat-skeleton-card bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50"
        >
          <div className="h-8 w-16 mx-auto rounded bg-[#E9E6FF] animate-pulse" />
          <div className="h-4 w-24 mt-3 mx-auto rounded bg-[#F1EEFF] animate-pulse" />
        </div>
      ))}
    </div>
  );
}
