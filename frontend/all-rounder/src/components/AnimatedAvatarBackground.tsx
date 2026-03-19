"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

type AnimatedAvatarBackgroundProps = {
  className?: string;
  intensity?: "soft" | "medium";
  preservePageColor?: boolean;
};

export default function AnimatedAvatarBackground({
  className = "",
  intensity = "medium",
  preservePageColor = true,
}: AnimatedAvatarBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const starsLayerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const orbsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const avatar = avatarRef.current;
    if (!root || !avatar) return;

    const stars = starsRef.current.filter((el): el is HTMLSpanElement => Boolean(el));
    const orbs = orbsRef.current.filter((el): el is HTMLDivElement => Boolean(el));
    const starsLayer = starsLayerRef.current;

    const yDelta = intensity === "soft" ? 12 : 18;
    const driftDuration = intensity === "soft" ? 4.4 : 3.6;

    const avatarTl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    avatarTl
      .to(avatar, {
        y: -yDelta,
        rotate: -4,
        scale: 1.05,
        duration: driftDuration * 0.42,
        ease: "sine.inOut",
      })
      .to(avatar, {
        y: yDelta * 0.65,
        rotate: 4,
        scale: 0.98,
        duration: driftDuration * 0.4,
        ease: "sine.inOut",
      })
      .to(avatar, {
        y: 0,
        rotate: 0,
        scale: 1.03,
        duration: driftDuration * 0.18,
        ease: "power2.out",
      })
      .to(avatar, {
        scale: 1.12,
        duration: 0.16,
        ease: "back.out(2.2)",
      })
      .to(avatar, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out",
      });

    gsap.to(stars, {
      scale: "random(0.85, 1.25)",
      opacity: "random(0.25, 0.7)",
      y: "random(-10, 10)",
      duration: "random(1.8, 3.4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2,
    });

    if (starsLayer) {
      gsap.to(starsLayer, {
        y: -8,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    gsap.to(orbs, {
      x: "random(-18, 18)",
      y: "random(-14, 14)",
      duration: "random(3.8, 6.2)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.25,
    });

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const centerX = () => window.innerWidth / 2;
    const centerY = () => window.innerHeight / 2;

    const moveAvatarX = gsap.quickTo(avatar, "x", { duration: 0.5, ease: "power3.out" });
    const moveAvatarY = gsap.quickTo(avatar, "y", { duration: 0.5, ease: "power3.out" });

    const starMovers = stars.map((star) => ({
      x: gsap.quickTo(star, "x", { duration: 0.45, ease: "power2.out" }),
      y: gsap.quickTo(star, "y", { duration: 0.45, ease: "power2.out" }),
    }));

    const orbMovers = orbs.map((orb) => ({
      x: gsap.quickTo(orb, "x", { duration: 0.65, ease: "power3.out" }),
      y: gsap.quickTo(orb, "y", { duration: 0.65, ease: "power3.out" }),
    }));

    const handlePointerMove = (event: PointerEvent) => {
      const nx = (event.clientX - centerX()) / centerX();
      const ny = (event.clientY - centerY()) / centerY();

      moveAvatarX(nx * 14);
      moveAvatarY(ny * 10);

      starMovers.forEach((mover, index) => {
        const depth = 6 + (index % 3) * 2;
        mover.x(nx * depth);
        mover.y(ny * depth);
      });

      orbMovers.forEach((mover, index) => {
        const depth = 12 + index * 3;
        mover.x(nx * depth);
        mover.y(ny * depth);
      });
    };

    const handlePointerLeave = () => {
      moveAvatarX(0);
      moveAvatarY(0);
      starMovers.forEach((mover) => {
        mover.x(0);
        mover.y(0);
      });
      orbMovers.forEach((mover) => {
        mover.x(0);
        mover.y(0);
      });
    };

    const scrollAvatarY = gsap.quickTo(avatar, "y", { duration: 0.55, ease: "power2.out" });
    const scrollStarY = stars.map((star) =>
      gsap.quickTo(star, "y", { duration: 0.5, ease: "power2.out" })
    );
    const scrollOrbY = orbs.map((orb) => gsap.quickTo(orb, "y", { duration: 0.7, ease: "power3.out" }));

    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const normalized = Math.max(-1, Math.min(1, scrollTop / 900));

      scrollAvatarY(normalized * 12);

      scrollStarY.forEach((moveY, index) => {
        const depth = 4 + (index % 3) * 2;
        moveY(normalized * depth);
      });

      scrollOrbY.forEach((moveY, index) => {
        const depth = 8 + index * 4;
        moveY(normalized * depth);
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [intensity]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {!preservePageColor && (
        <>
          <div
            ref={(el) => {
              orbsRef.current[0] = el;
            }}
            className="bg-orb absolute -top-24 -left-16 w-72 h-72 rounded-full blur-3xl opacity-30 bg-white"
          />
          <div
            ref={(el) => {
              orbsRef.current[1] = el;
            }}
            className="bg-orb absolute top-8 right-4 w-64 h-64 rounded-full blur-3xl opacity-25 bg-white"
          />
          <div
            ref={(el) => {
              orbsRef.current[2] = el;
            }}
            className="bg-orb absolute -bottom-20 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 bg-[#F8F8FF]"
          />
        </>
      )}

      <div ref={avatarRef} className="absolute right-8 top-24 sm:right-14 sm:top-20 opacity-30 sm:opacity-35">
        <div className="absolute inset-0 blur-2xl rounded-full bg-white/60 scale-90" />
        <Image
          src="/icons/Avatar.png"
          alt="Decorative avatar"
          width={170}
          height={170}
          sizes="(max-width: 640px) 120px, 170px"
          className="drop-shadow-2xl"
          priority={false}
        />
      </div>

      <div ref={starsLayerRef} className="absolute inset-0">
        <span
          ref={(el) => {
            starsRef.current[0] = el;
          }}
          className="bg-star absolute top-12 left-8 text-3xl text-white/80"
        >
          ★
        </span>
        <span
          ref={(el) => {
            starsRef.current[1] = el;
          }}
          className="bg-star absolute top-24 right-1/3 text-2xl text-white/75"
        >
          ★
        </span>
        <span
          ref={(el) => {
            starsRef.current[2] = el;
          }}
          className="bg-star absolute top-1/2 left-1/4 text-4xl text-white/65"
        >
          ★
        </span>
        <span
          ref={(el) => {
            starsRef.current[3] = el;
          }}
          className="bg-star absolute bottom-24 right-10 text-3xl text-white/70"
        >
          ★
        </span>
        <span
          ref={(el) => {
            starsRef.current[4] = el;
          }}
          className="bg-star absolute bottom-14 left-12 text-2xl text-white/75"
        >
          ★
        </span>
        <span
          ref={(el) => {
            starsRef.current[5] = el;
          }}
          className="bg-star absolute top-1/3 right-14 text-xl text-white/80"
        >
          ★
        </span>
      </div>
    </div>
  );
}
