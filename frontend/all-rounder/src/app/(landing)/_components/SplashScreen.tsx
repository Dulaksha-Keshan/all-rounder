'use client';
import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function SplashScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const starTrailLayerRef = useRef<HTMLDivElement>(null);
  const bgStarLayerRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set([stageRef.current, avatarRef.current, haloRef.current, titleRef.current, letterRefs.current, dotRefs.current], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      const titleWidth = titleWrapRef.current?.offsetWidth ?? 280;
      const orbitX = Math.max(180, titleWidth * 0.48 + 40);
      const orbitY = 140;
      const entryX = orbitX + 260;
      const entryY = -orbitY - 220;

      gsap.set(stageRef.current, { opacity: 0, y: 30, scale: 0.95 });
      gsap.set(letterRefs.current, {
        opacity: 0,
        y: 38,
        rotateX: -70,
        rotateZ: -8,
        rotateY: gsap.utils.random(-12, 12),
        scale: 0.6,
        transformOrigin: '50% 100%',
        perspective: 1200,
      });
      gsap.set(avatarRef.current, {
        opacity: 0,
        scale: 0.48,
        rotate: 22,
        x: entryX,
        y: entryY,
      });
      gsap.set(haloRef.current, { opacity: 0, scale: 0.75 });
      gsap.set(dotRefs.current, { opacity: 0, y: 10 });

      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      introTl
        .to(stageRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.48,
        })
        .to(
          letterRefs.current,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            rotateZ: 0,
            rotateY: 0,
            scale: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: 'back.out(2)',
          },
          '-=0.16'
        )
        .to(
          avatarRef.current,
          {
            opacity: 1,
            scale: 1,
            rotate: 8,
            x: orbitX,
            y: 0,
            duration: 0.82,
            ease: 'cubic.inOut',
          },
          '-=0.42'
        )
        .to(
          haloRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
          },
          '-=0.35'
        )
        .to(
          dotRefs.current,
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.28,
            ease: 'power2.out',
          },
          '-=0.2'
        );

      gsap.to(titleRef.current, {
        filter: 'drop-shadow(0 0 16px rgba(200, 180, 255, 0.4))',
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: 'sine.inOut',
        delay: 0.9,
      });

      // Avatar runs around the title in a smooth loop.
      gsap.to(avatarRef.current, {
        keyframes: [
          { x: orbitX, y: 0, rotate: 8, duration: 0.7 },
          { x: orbitX * 0.62, y: -orbitY * 0.6, rotate: -12, duration: 0.65 },
          { x: 0, y: -orbitY, rotate: 12, duration: 0.65 },
          { x: -orbitX * 0.62, y: -orbitY * 0.6, rotate: -10, duration: 0.65 },
          { x: -orbitX, y: 0, rotate: 10, duration: 0.7 },
          { x: -orbitX * 0.62, y: orbitY * 0.6, rotate: -8, duration: 0.65 },
          { x: 0, y: orbitY, rotate: 9, duration: 0.65 },
          { x: orbitX * 0.62, y: orbitY * 0.6, rotate: -6, duration: 0.65 },
          { x: orbitX, y: 0, rotate: 8, duration: 0.7 },
        ],
        repeat: -1,
        ease: 'none',
        delay: 1.55,
      });

      let prevX: number | null = null;
      let prevY: number | null = null;
      let lastEmit = 0;
      let lastBgEmit = 0;

      const emitTrailStar = () => {
        const layer = starTrailLayerRef.current;
        const avatar = avatarRef.current;
        if (!layer || !avatar) return;

        const rootBounds = root.getBoundingClientRect();
        const avatarBounds = avatar.getBoundingClientRect();
        const currentX = avatarBounds.left - rootBounds.left + avatarBounds.width / 2;
        const currentY = avatarBounds.top - rootBounds.top + avatarBounds.height / 2;

        if (prevX === null || prevY === null) {
          prevX = currentX;
          prevY = currentY;
          return;
        }

        const velocityX = currentX - prevX;
        const velocityY = currentY - prevY;
        prevX = currentX;
        prevY = currentY;

        const speed = Math.hypot(velocityX, velocityY);
        const directionX = speed > 0.001 ? velocityX / speed : 0;
        const directionY = speed > 0.001 ? velocityY / speed : 0;
        const trailingDistance = Math.max(14, avatarBounds.width * 0.42);
        const spawnX = currentX - directionX * trailingDistance;
        const spawnY = currentY - directionY * trailingDistance;

        const star = document.createElement('span');
        star.className = 'pointer-events-none absolute rounded-full bg-white/95';
        const starSize = gsap.utils.random(2.8, 5.2);
        star.style.width = `${starSize}px`;
        star.style.height = `${starSize}px`;
        star.style.left = `${spawnX}px`;
        star.style.top = `${spawnY}px`;
        star.style.boxShadow = '0 0 14px rgba(255,255,255,0.9)';
        layer.appendChild(star);

        const driftX = -directionX * gsap.utils.random(34, 66) + gsap.utils.random(-18, 18);
        const driftY = -directionY * gsap.utils.random(34, 66) + gsap.utils.random(-18, 18);

        gsap.fromTo(
          star,
          {
            opacity: 0.95,
            scale: gsap.utils.random(0.7, 1.2),
            x: 0,
            y: 0,
          },
          {
            opacity: 0,
            scale: 0,
            x: driftX,
            y: driftY,
            duration: gsap.utils.random(0.65, 1.15),
            ease: 'power2.out',
            onComplete: () => star.remove(),
          }
        );
      };

      const emitBackgroundStar = () => {
        const layer = bgStarLayerRef.current;
        if (!layer) return;

        const rootBounds = root.getBoundingClientRect();
        const star = document.createElement('span');
        const size = gsap.utils.random(2.2, 4.8);
        const startX = gsap.utils.random(0, rootBounds.width);
        const driftX = gsap.utils.random(-34, 34);

        star.className = 'pointer-events-none absolute rounded-full bg-white/90';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${startX}px`;
        star.style.top = '-18px';
        star.style.boxShadow = '0 0 12px rgba(255,255,255,0.78)';
        layer.appendChild(star);

        gsap.fromTo(
          star,
          { opacity: 0.2, x: 0, y: 0 },
          {
            opacity: 0.95,
            x: driftX,
            y: rootBounds.height + 32,
            duration: gsap.utils.random(2.8, 4.8),
            ease: 'none',
            onComplete: () => star.remove(),
          }
        );
      };

      const trailTicker = () => {
        const now = performance.now();
        if (now - lastEmit < 32) return;
        lastEmit = now;
        emitTrailStar();
        if (Math.random() > 0.4) emitTrailStar();
      };

      const bgStarTicker = () => {
        const now = performance.now();
        if (now - lastBgEmit < 90) return;
        lastBgEmit = now;
        emitBackgroundStar();
      };

      gsap.ticker.add(trailTicker);
      gsap.ticker.add(bgStarTicker);

      gsap.to(haloRef.current, {
        scale: 1.18,
        opacity: 0.6,
        repeat: -1,
        yoyo: true,
        duration: 0.95,
        ease: 'sine.inOut',
        delay: 0.72,
      });

      gsap.to(letterRefs.current, {
        y: '-=8',
        rotateZ: 2,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: 'sine.inOut',
        stagger: {
          each: 0.07,
          from: 'start',
        },
        delay: 1.2,
      });

      gsap.to(dotRefs.current, {
        y: -11,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: 'power1.inOut',
        stagger: {
          each: 0.1,
          repeat: -1,
          yoyo: true,
        },
        delay: 0.9,
      });

      gsap.to(orbRefs.current[0], {
        x: 30,
        y: -18,
        scale: 1.16,
        repeat: -1,
        yoyo: true,
        duration: 4.2,
        ease: 'sine.inOut',
      });

      gsap.to(orbRefs.current[1], {
        x: -28,
        y: -20,
        scale: 0.9,
        repeat: -1,
        yoyo: true,
        duration: 3.8,
        ease: 'sine.inOut',
      });

      gsap.to(orbRefs.current[2], {
        x: 18,
        y: 18,
        scale: 1.2,
        repeat: -1,
        yoyo: true,
        duration: 3.5,
        ease: 'sine.inOut',
      });

      return () => {
        gsap.ticker.remove(trailTicker);
        gsap.ticker.remove(bgStarTicker);
        starTrailLayerRef.current?.replaceChildren();
        bgStarLayerRef.current?.replaceChildren();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  const title = 'ALL-ROUNDER';

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2a1a4a] via-[var(--primary-dark-purple)] to-[#1a0f2e]"
    >
      <div ref={bgStarLayerRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden />
      <div className="absolute inset-0 opacity-25">
        <div
          ref={(el) => {
            orbRefs.current[0] = el;
          }}
          className="absolute left-8 top-14 h-28 w-28 rounded-full bg-[var(--primary-purple)] blur-3xl"
        />
        <div
          ref={(el) => {
            orbRefs.current[1] = el;
          }}
          className="absolute bottom-10 right-8 h-36 w-36 rounded-full bg-[var(--secondary-light-lavender)] blur-3xl"
        />
        <div
          ref={(el) => {
            orbRefs.current[2] = el;
          }}
          className="absolute right-1/4 top-1/4 h-24 w-24 rounded-full bg-[var(--white)] blur-2xl"
        />
      </div>

      <div
        ref={stageRef}
        className="relative z-20 mx-4 flex w-full max-w-6xl flex-col items-center justify-center px-4 py-16"
      >
        <div className="relative flex min-h-[320px] w-full items-center justify-center sm:min-h-[380px]">
          <div ref={starTrailLayerRef} className="pointer-events-none absolute inset-[-120px] z-30" aria-hidden />
          <div
            ref={titleWrapRef}
            className="relative px-2"
          >
            <div
              ref={titleRef}
              className="relative text-center text-5xl font-black tracking-[0.09em] sm:text-6xl lg:text-8xl"
              style={{
                fontFamily: "'Righteous', 'Fredoka', 'Poppins', sans-serif",
                color: '#ffffff',
              }}
            >
              {title.split('').map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  ref={(el) => {
                    letterRefs.current[index] = el;
                  }}
                  className="inline-block text-[#ffffff]"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div ref={avatarRef} className="absolute left-1/2 top-1/2 z-40 h-24 w-24 -translate-x-1/2 -translate-y-1/2 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
            <div
              ref={haloRef}
              className="absolute inset-0 rounded-full bg-[var(--secondary-light-lavender)]/55 blur-lg"
              aria-hidden
            />
            <Image
              src="/icons/Avatar.png"
              alt="Star Avatar"
              width={180}
              height={180}
              priority
              className="relative h-full w-full drop-shadow-[0_0_28px_rgba(220,208,255,0.82)]"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          {['#d8c6ff', '#ffffff', '#87b9ff'].map((color, index) => (
            <div
              key={color}
              ref={(el) => {
                dotRefs.current[index] = el;
              }}
              className="h-4 w-4 rounded-full"
              style={{ background: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
