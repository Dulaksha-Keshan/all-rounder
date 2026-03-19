"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GlobalCursorFX() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!root || !dot || !ring) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    // Keep native behavior on touch devices and reduced-motion environments.
    if (prefersReducedMotion || !hasFinePointer) {
      root.style.display = "none";
      return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const moveDotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const moveRingX = gsap.quickTo(ring, "x", { duration: 0.28, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.28, ease: "power3.out" });

    const updateTrail = (nextX: number, nextY: number) => {
      trailsRef.current.forEach((el, index) => {
        if (!el) return;
        gsap.to(el, {
          x: nextX,
          y: nextY,
          duration: 0.2 + index * 0.05,
          ease: "power2.out",
        });
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;

      moveDotX(x);
      moveDotY(y);
      moveRingX(x);
      moveRingY(y);
      updateTrail(x, y);
    };

    const handlePointerDown = (event: PointerEvent) => {
      gsap.fromTo(
        ring,
        { scale: 1 },
        { scale: 0.72, duration: 0.12, ease: "power2.out" }
      );

      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0.2, opacity: 0.65 },
        {
          scale: 1.9,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    const handlePointerUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.2, ease: "power2.out" });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    // Fade in once mounted.
    gsap.to(root, { opacity: 1, duration: 0.4, ease: "power2.out" });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div ref={rootRef} className="global-cursor-fx" aria-hidden>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`trail-${index}`}
          ref={(el) => {
            trailsRef.current[index] = el;
          }}
          className="cursor-trail-dot"
        />
      ))}
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
