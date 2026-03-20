"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function StudentProfileLoading() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    const blocks = wrapRef.current.querySelectorAll(".student-loading-block");
    gsap.fromTo(
      blocks,
      { y: 18, opacity: 0.35 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF] p-4 md:p-8">
      <div ref={wrapRef} className="max-w-7xl mx-auto mt-20 space-y-6">
        <div className="student-loading-block surface-readable-strong rounded-xl p-8">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-[#E9E6FF] animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-56 rounded bg-[#E9E6FF] animate-pulse" />
              <div className="h-4 w-64 rounded bg-[#F1EEFF] animate-pulse" />
              <div className="h-4 w-48 rounded bg-[#F1EEFF] animate-pulse" />
            </div>
          </div>
        </div>

        <div className="student-loading-block h-16 surface-readable-strong rounded-xl animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="student-loading-block md:col-span-2 h-64 surface-readable rounded-xl animate-pulse" />
          <div className="student-loading-block h-64 surface-readable rounded-xl animate-pulse" />
        </div>

        <div className="student-loading-block h-72 surface-readable rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
