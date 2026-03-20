"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, User, School, Building2, CheckCircle } from "lucide-react";
import gsap from "gsap";

const userTypes = [
  {
    type: "student",
    title: "Student",
    description: "Build your verified extracurricular identity",
    icon: GraduationCap,
    features: [
      "Verified extracurricular profile",
      "Achievement verification system",
      "Track activity and growth",
    ],
    accentColor: "var(--primary-purple)",
  },
  {
    type: "teacher",
    title: "Teacher",
    description: "Validate and mentor student growth",
    icon: User,
    features: [
      "Verify student profiles",
      "Approve achievements",
      "Mentor student progress",
    ],
    accentColor: "var(--primary-blue)",
  },
  {
    type: "school",
    title: "School",
    description: "Oversee institutional credibility and growth",
    icon: School,
    features: [
      "Verify teachers and students",
      "Manage institutional profiles",
      "Collaborate with partners",
    ],
    accentColor: "var(--primary-dark-purple)",
  },
  {
    type: "organization",
    title: "Organization",
    description: "Empower and recognize student excellence",
    icon: Building2,
    features: [
      "Verify achievements",
      "Host events and competitions",
      "Support through partnerships",
    ],
    accentColor: "var(--primary-purple)",
  },
];

export default function SignupPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from(".signup-hero", { y: 28, opacity: 0, duration: 0.8 })
        .from(
          ".signup-grid .signup-role-card",
          { y: 26, opacity: 0, duration: 0.7, stagger: 0.1 },
          "-=0.35"
        )
        .from(".signup-info-card", { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.25");
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen py-20 px-4 relative"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="signup-hero text-center mb-16">
          <div className="flex justify-center mb-8">
            <Image
              src="/icons/logoForPages.png"
              alt="All-Rounder Logo"
              width={72}
              height={72}
              priority
            />
          </div>

          <h1 className="text-primary-dark text-4xl md:text-5xl font-bold mb-4">
            Join All-Rounder
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Choose your account type to begin your journey
          </p>
        </div>

        {/* User Type Cards */}
        <div className="signup-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-7xl mx-auto">
          {userTypes.map((userType) => {
            const Icon = userType.icon;

            return (
              <div
                key={userType.type}
                className="signup-role-card group surface-readable rounded-2xl p-6 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl flex flex-col h-full relative overflow-hidden"
              >
                {/* Subtle gradient glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top, ${userType.accentColor}, transparent)`,
                  }}
                />
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                  style={{ background: userType.accentColor }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-primary-dark text-xl font-bold mb-2">
                  {userType.title}
                </h3>

                {/* Description */}
                <p className="text-muted text-sm mb-5 leading-relaxed">
                  {userType.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-grow">
                  {userType.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-sm text-gray-700"
                    >
                      <CheckCircle 
                        className="w-4 h-4 mt-0.5 flex-shrink-0" 
                        style={{ color: userType.accentColor }}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button - Fixed at bottom */}
                <Link
                  href={`/signUp/${userType.type}`}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-white py-3 px-4 rounded-xl transition-all group-hover:shadow-lg mt-auto"
                  style={{ background: userType.accentColor }}
                >
                  Sign up
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Already have account */}
        <div className="signup-info-card surface-readable-strong rounded-2xl p-8 max-w-2xl mx-auto mb-12 text-center">
          <h3 className="text-primary-dark text-xl font-bold mb-3">
            Already have an account?
          </h3>
          <p className="text-muted text-sm mb-6">
            Log in to access your dashboard and continue your journey.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all text-white hover:shadow-lg"
            style={{ background: "var(--primary-blue)" }}
          >
            Go to Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Verification Requirements */}
        <div className="signup-info-card surface-readable-strong rounded-2xl p-8 max-w-4xl mx-auto">
          <h4 className="text-primary-dark text-lg font-bold mb-6 text-center">
            Verification Requirements
          </h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Students", desc: "Account requires approval from a verified teacher", color: "var(--primary-purple)" },
              { title: "Teachers", desc: "Employment verification documents needed", color: "var(--primary-blue)" },
              { title: "Schools", desc: "Official documentation required for verification", color: "var(--primary-dark-purple)" },
              { title: "Organizations", desc: "Registration details verified before approval", color: "var(--primary-purple)" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ background: item.color }}
                />
                <div>
                  <p className="text-sm font-semibold text-primary-dark mb-1">{item.title}</p>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}