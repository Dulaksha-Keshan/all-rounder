"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import InteractiveStarfieldBackground from "@/components/InteractiveStarfieldBackground";
import { useUserStore } from "@/context/useUserStore";

const VERIFICATION_RECHECK_INTERVAL_MS = 30 * 60 * 1000;

export default function VerificationPendingPage() {
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isVerified = useUserStore((state) => state.isVerified);
  const fetchBackendProfile = useUserStore((state) => state.fetchBackendProfile);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const etaRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (isVerified === true) {
      router.replace("/home");
      return;
    }

    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isVerified, router]);

  useEffect(() => {
    const recheckVerification = async () => {
      try {
        if (document.visibilityState !== "visible") {
          return;
        }
        await fetchBackendProfile();
      } catch (error) {
        console.warn("Verification status recheck failed:", error);
      }
    };

    const intervalId = window.setInterval(recheckVerification, VERIFICATION_RECHECK_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void recheckVerification();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchBackendProfile]);

  useEffect(() => {
    if (!wrapperRef.current || !badgeRef.current || !titleRef.current || !descriptionRef.current || !etaRef.current) {
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .fromTo(
        badgeRef.current,
        { y: 30, opacity: 0, scale: 0.85 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8 }
      )
      .fromTo(
        titleRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        "-=0.35"
      )
      .fromTo(
        descriptionRef.current,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.3"
      )
      .fromTo(
        etaRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        "-=0.25"
      );

    gsap.to(badgeRef.current, {
      boxShadow: "0 0 0px rgba(131, 135, 204, 0), 0 0 36px rgba(131, 135, 204, 0.45)",
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: "sine.inOut",
    });

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10"
      style={{
        background:
          "linear-gradient(145deg, var(--secondary-pale-lavender) 0%, var(--secondary-light-lavender) 28%, #ffffff 50%, var(--secondary-light-lavender) 76%, var(--secondary-pale-lavender) 100%)",
      }}
    >
      <InteractiveStarfieldBackground className="absolute inset-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center rounded-3xl border px-6 py-12 text-center shadow-2xl backdrop-blur-xl md:px-12 md:py-16"
        style={{
          borderColor: "rgba(220, 208, 255, 0.9)",
          background: "linear-gradient(160deg, rgba(255,255,255,0.9), rgba(248,248,255,0.88))",
        }}
      >
        <div
          ref={badgeRef}
          className="mb-6 inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]"
          style={{
            borderColor: "rgba(131, 135, 204, 0.45)",
            backgroundColor: "rgba(220, 208, 255, 0.4)",
            color: "var(--accent-purple-text)",
          }}
        >
          Verification Pending
        </div>

        <h1
          ref={titleRef}
          className="text-4xl font-semibold leading-tight md:text-6xl"
          style={{ color: "var(--primary-dark-purple)" }}
        >
          Your account is authenticated and waiting for approval.
        </h1>

        <p
          ref={descriptionRef}
          className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg"
          style={{ color: "var(--gray-600)" }}
        >
          Our team is reviewing your verification request right now. You will get an update as soon as the review is complete.
        </p>

        <p
          ref={etaRef}
          className="mt-5 rounded-2xl border px-5 py-3 text-sm font-medium md:text-base"
          style={{
            borderColor: "rgba(65, 105, 225, 0.34)",
            backgroundColor: "rgba(131, 135, 204, 0.15)",
            color: "var(--primary-blue)",
          }}
        >
          Typical review time is around 48 hours.
        </p>
      </div>
    </section>
  );
}
