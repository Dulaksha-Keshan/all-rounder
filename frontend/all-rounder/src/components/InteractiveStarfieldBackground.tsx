"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  speed: number;
}

interface InteractiveStarfieldBackgroundProps {
  starCount?: number;
  className?: string;
  variant?: "default" | "landing";
}

const THEMES = {
  default: {
    baseBackground:
      "linear-gradient(152deg, rgba(225, 196, 255, 0.96) 0%, rgba(173, 196, 255, 0.84) 48%, rgba(255, 255, 255, 0.78) 100%)",
    canvasWash: "rgba(228, 203, 255, 0.36)",
    centerGlow: "rgba(186, 137, 234, 0.4)",
    midGlow: "rgba(65, 105, 225, 0.44)",
    edgeGlow: "rgba(255, 255, 255, 0.1)",
    particleColor: [236, 242, 255] as const,
    minParticleAlpha: 0.32,
    alphaScale: 0.44,
    pointerInfluence: 260,
    pointerPull: 0.015,
    overlay:
      "radial-gradient(circle_at_16%_20%,rgba(197,156,240,0.52),transparent_44%),radial-gradient(circle_at_82%_18%,rgba(65,105,225,0.44),transparent_46%),radial-gradient(circle_at_48%_80%,rgba(223,195,255,0.46),transparent_50%)",
  },
  landing: {
    baseBackground:
      "linear-gradient(158deg, rgba(229, 205, 255, 0.96) 0%, rgba(196, 205, 255, 0.82) 42%, rgba(255, 255, 255, 0.86) 100%)",
    canvasWash: "rgba(236, 218, 255, 0.28)",
    centerGlow: "rgba(200, 154, 236, 0.3)",
    midGlow: "rgba(91, 113, 235, 0.34)",
    edgeGlow: "rgba(255, 255, 255, 0.06)",
    particleColor: [255, 255, 255] as const,
    minParticleAlpha: 0.3,
    alphaScale: 0.38,
    pointerInfluence: 240,
    pointerPull: 0.013,
    overlay:
      "radial-gradient(circle_at_18%_22%,rgba(221,188,255,0.46),transparent_42%),radial-gradient(circle_at_82%_20%,rgba(65,105,225,0.34),transparent_48%),radial-gradient(circle_at_50%_82%,rgba(255,255,255,0.3),transparent_52%)",
  },
};

export default function InteractiveStarfieldBackground({
  starCount = 180,
  className = "",
  variant = "default",
}: InteractiveStarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = THEMES[variant];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let rafId = 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const deviceScale = width < 768 ? 0.58 : width < 1200 ? 0.8 : 1;
    const motionScale = prefersReducedMotion ? 0.6 : 1;
    const resolvedStarCount = Math.max(70, Math.min(320, Math.round(starCount * deviceScale * motionScale)));

    const pointer = {
      x: width * 0.5,
      y: height * 0.5,
      influence: theme.pointerInfluence,
    };

    const stars: Star[] = Array.from({ length: resolvedStarCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1.2 + 0.15,
      speed: (Math.random() * 0.45 + 0.12) * motionScale,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = theme.canvasWash;
      context.fillRect(0, 0, width, height);

      const gradient = context.createRadialGradient(
        pointer.x,
        pointer.y,
        30,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, theme.centerGlow);
      gradient.addColorStop(0.4, theme.midGlow);
      gradient.addColorStop(1, theme.edgeGlow);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      for (const star of stars) {
        const dx = pointer.x - star.x;
        const dy = pointer.y - star.y;
        const distance = Math.hypot(dx, dy) || 1;
        const pull = Math.max(0, (pointer.influence - distance) / pointer.influence);

        star.x += dx * pull * theme.pointerPull * star.z;
        star.y += dy * pull * theme.pointerPull * star.z;
        star.y -= star.speed * star.z;

        if (star.y < -8) {
          star.y = height + 8;
          star.x = Math.random() * width;
        }

        if (star.x < -8) {
          star.x = width + 8;
        }

        if (star.x > width + 8) {
          star.x = -8;
        }

        const radius = variant === "landing" ? 1.4 + star.z * 2.55 : 1.35 + star.z * 2.35;
        context.beginPath();
        context.arc(star.x, star.y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${theme.particleColor[0]}, ${theme.particleColor[1]}, ${theme.particleColor[2]}, ${theme.minParticleAlpha + star.z * theme.alphaScale})`;
        context.fill();
      }

      rafId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [starCount, variant, theme.centerGlow, theme.edgeGlow, theme.midGlow, theme.minParticleAlpha, theme.alphaScale, theme.particleColor, theme.canvasWash, theme.pointerInfluence, theme.pointerPull]);

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`.trim()} aria-hidden>
      <div className="absolute inset-0" style={{ background: theme.baseBackground }} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0" style={{ background: theme.overlay }} />
    </div>
  );
}
