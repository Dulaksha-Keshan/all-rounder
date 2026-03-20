"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HomeLoading() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    const title = wrapRef.current.querySelector(".home-loading-title");
    const blocks = wrapRef.current.querySelectorAll(".home-loading-block");

    gsap.fromTo(
      title,
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );

    gsap.fromTo(
      blocks,
      { y: 20, opacity: 0.35 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div
      ref={wrapRef}
      className="min-h-screen bg-[var(--page-bg)] p-4 md:p-6 lg:p-8"
    >
      <div className="home-loading-title h-10 w-48 rounded-xl bg-[var(--gray-100)] animate-pulse mb-8" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="home-loading-block h-24 rounded-xl bg-[var(--gray-100)] border border-[var(--gray-200)] animate-pulse"
          />
        ))}
      </div>

      <div className="grid grid-cols-[1fr_240px] md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-4 md:gap-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="home-loading-block h-40 rounded-xl bg-[var(--gray-100)] border border-[var(--gray-200)] animate-pulse"
            />
          ))}
        </div>

        <div className="space-y-4">
          <div className="home-loading-block h-56 rounded-xl bg-[var(--gray-100)] border border-[var(--gray-200)] animate-pulse" />
          <div className="home-loading-block h-44 rounded-xl bg-[var(--gray-100)] border border-[var(--gray-200)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
