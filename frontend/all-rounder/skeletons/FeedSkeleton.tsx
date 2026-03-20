"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FeedSkeletonProps {
  items?: number;
}

export default function FeedSkeleton({ items = 3 }: FeedSkeletonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    const cards = wrapRef.current.querySelectorAll(".feed-skeleton-card");

    gsap.fromTo(
      cards,
      { y: 16, opacity: 0.45 },
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
    <div ref={wrapRef} className="w-full space-y-6">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="feed-skeleton-card rounded-2xl border border-[#DCD0FF]/60 bg-white/95 p-5 shadow-lg"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-[#E9E6FF] animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 rounded bg-[#E6E2FF] animate-pulse" />
              <div className="h-3 w-24 rounded bg-[#F1EEFF] animate-pulse" />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="h-4 w-4/5 rounded bg-[#ECE8FF] animate-pulse" />
            <div className="h-4 w-full rounded bg-[#F1EEFF] animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-[#ECE8FF] animate-pulse" />
          </div>

          <div className="mt-5 h-56 rounded-xl bg-[#F4F2FF] animate-pulse" />

          <div className="mt-5 flex gap-3">
            <div className="h-9 w-24 rounded-lg bg-[#E9E6FF] animate-pulse" />
            <div className="h-9 w-24 rounded-lg bg-[#EEEAFE] animate-pulse" />
            <div className="h-9 w-24 rounded-lg bg-[#E9E6FF] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
