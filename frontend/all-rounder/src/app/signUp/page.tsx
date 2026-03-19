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
      const stars = gsap.utils.toArray<HTMLElement>(".auth-stars > div");
      const orbs = gsap.utils.toArray<HTMLElement>(".auth-orb");

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from(".signup-hero", { y: 28, opacity: 0, duration: 0.8 })
        .from(
          ".signup-grid .signup-role-card",
          { y: 26, opacity: 0, duration: 0.7, stagger: 0.1 },
          "-=0.35"
        )
        .from(".signup-info-card", { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.25");

      gsap.to(orbs, {
        y: "random(-14, 14)",
        x: "random(-10, 10)",
        duration: "random(5.5, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      gsap.to(stars, {
        y: "random(-10, 10)",
        x: "random(-6, 6)",
        duration: "random(2.6, 4.4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.08,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen py-20 px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--secondary-pale-lavender) 0%, var(--secondary-light-lavender) 25%, #ffffff 50%, var(--secondary-light-lavender) 75%, var(--secondary-pale-lavender) 100%)",
      }}
    >
      {/* Colorful Gradient Orbs */}
      <div
        className="auth-orb absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl pointer-events-none animate-pulse"
        style={{ background: "var(--primary-purple)", animationDuration: "6s" }}
      />
      <div
        className="auth-orb absolute top-20 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none animate-pulse"
        style={{ background: "var(--primary-blue)", animationDuration: "7s", animationDelay: "0.6s" }}
      />
      <div
        className="auth-orb absolute bottom-0 -left-24 w-[450px] h-[450px] rounded-full opacity-22 blur-3xl pointer-events-none animate-pulse"
        style={{ background: "var(--secondary-purple-light)", animationDuration: "8s", animationDelay: "1.2s" }}
      />
      <div
        className="auth-orb absolute -bottom-32 right-10 w-[520px] h-[520px] rounded-full opacity-18 blur-3xl pointer-events-none animate-pulse"
        style={{ background: "var(--secondary-light-lavender)", animationDuration: "7.2s", animationDelay: "0.9s" }}
      />
      <div
        className="auth-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full opacity-12 blur-3xl pointer-events-none animate-pulse"
        style={{ background: "var(--primary-dark-purple)", animationDuration: "9s", animationDelay: "1.5s" }}
      />

      {/* Beautiful Star Field Background */}
      <div className="auth-stars">
      <div className="absolute top-10 left-[8%] text-4xl opacity-45 animate-pulse" style={{ color: "var(--primary-purple)", animationDuration: "3s" }}>★</div>
      <div className="absolute top-24 right-[12%] text-3xl opacity-40 animate-pulse" style={{ color: "var(--primary-blue)", animationDuration: "4s", animationDelay: "0.5s" }}>★</div>
      <div className="absolute top-40 left-[25%] text-2xl opacity-35 animate-pulse" style={{ color: "var(--primary-dark-purple)", animationDuration: "3.5s", animationDelay: "1s" }}>★</div>
      <div className="absolute top-1/4 right-[30%] text-3xl opacity-42 animate-pulse" style={{ color: "var(--primary-purple)", animationDuration: "4.5s", animationDelay: "0.8s" }}>★</div>
      <div className="absolute top-1/3 left-[15%] text-5xl opacity-40 animate-pulse" style={{ color: "var(--primary-blue)", animationDuration: "3.8s", animationDelay: "1.5s" }}>★</div>
      <div className="absolute top-16 left-[45%] text-3xl opacity-38 animate-pulse" style={{ color: "var(--primary-dark-purple)", animationDuration: "4.2s", animationDelay: "0.4s" }}>★</div>
      <div className="absolute top-32 right-[5%] text-2xl opacity-36 animate-pulse" style={{ color: "var(--primary-purple)", animationDuration: "3.6s", animationDelay: "1.1s" }}>★</div>
      <div className="absolute top-48 left-[60%] text-4xl opacity-44 animate-pulse" style={{ color: "var(--primary-blue)", animationDuration: "4.1s", animationDelay: "0.9s" }}>★</div>
      <div className="absolute top-1/4 left-[3%] text-3xl opacity-37 animate-pulse" style={{ color: "var(--primary-dark-purple)", animationDuration: "3.4s", animationDelay: "1.3s" }}>★</div>
      <div className="absolute top-36 right-[25%] text-2xl opacity-39 animate-pulse" style={{ color: "var(--primary-purple)", animationDuration: "3.9s", animationDelay: "0.6s" }}>★</div>
      
      <div className="absolute bottom-1/4 left-[10%] text-4xl opacity-43 animate-pulse" style={{ color: "var(--primary-blue)", animationDuration: "4s", animationDelay: "0.3s" }}>★</div>
      <div className="absolute bottom-1/3 right-[18%] text-3xl opacity-38 animate-pulse" style={{ color: "var(--primary-dark-purple)", animationDuration: "3.2s", animationDelay: "1.2s" }}>★</div>
      <div className="absolute bottom-40 left-[35%] text-2xl opacity-35 animate-pulse" style={{ color: "var(--primary-purple)", animationDuration: "3.5s", animationDelay: "0.7s" }}>★</div>
      <div className="absolute bottom-32 right-[8%] text-4xl opacity-46 animate-pulse" style={{ color: "var(--primary-blue)", animationDuration: "4.2s", animationDelay: "1.8s" }}>★</div>
      <div className="absolute bottom-20 left-[22%] text-3xl opacity-41 animate-pulse" style={{ color: "var(--primary-dark-purple)", animationDuration: "3.7s", animationDelay: "0.9s" }}>★</div>
      <div className="absolute bottom-16 right-[45%] text-2xl opacity-36 animate-pulse" style={{ color: "var(--primary-purple)", animationDuration: "3.3s", animationDelay: "1.4s" }}>★</div>
      <div className="absolute bottom-36 left-[5%] text-3xl opacity-42 animate-pulse" style={{ color: "var(--primary-blue)", animationDuration: "4.4s", animationDelay: "0.2s" }}>★</div>
      <div className="absolute bottom-48 right-[35%] text-4xl opacity-44 animate-pulse" style={{ color: "var(--primary-dark-purple)", animationDuration: "3.1s", animationDelay: "1.6s" }}>★</div>
      <div className="absolute bottom-24 left-[55%] text-2xl opacity-39 animate-pulse" style={{ color: "var(--primary-purple)", animationDuration: "3.8s", animationDelay: "0.5s" }}>★</div>
      <div className="absolute bottom-1/3 left-[70%] text-3xl opacity-37 animate-pulse" style={{ color: "var(--primary-blue)", animationDuration: "4.3s", animationDelay: "1.1s" }}>★</div>
      
      <div className="absolute top-3/5 left-[12%] text-2xl opacity-36 animate-pulse" style={{ color: "var(--primary-purple)", animationDuration: "3.4s", animationDelay: "1.5s" }}>★</div>
      <div className="absolute top-3/5 right-[38%] text-3xl opacity-41 animate-pulse" style={{ color: "var(--primary-blue)", animationDuration: "3.7s", animationDelay: "0.4s" }}>★</div>
      <div className="absolute top-2/5 left-[28%] text-2xl opacity-37 animate-pulse" style={{ color: "var(--primary-dark-purple)", animationDuration: "4.5s", animationDelay: "1.2s" }}>★</div>
      <div className="absolute top-2/5 right-[15%] text-4xl opacity-42 animate-pulse" style={{ color: "var(--primary-purple)", animationDuration: "3.2s", animationDelay: "0.9s" }}>★</div>
      <div className="absolute top-3/4 left-[50%] text-3xl opacity-38 animate-pulse" style={{ color: "var(--primary-blue)", animationDuration: "3.9s", animationDelay: "1.3s" }}>★</div>
      <div className="absolute top-4/5 right-[28%] text-2xl opacity-40 animate-pulse" style={{ color: "var(--primary-dark-purple)", animationDuration: "4.2s", animationDelay: "0.7s" }}>★</div>
      </div>

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
                className="signup-role-card group bg-card rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl flex flex-col h-full relative overflow-hidden"
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
        <div className="signup-info-card bg-card rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto mb-12 text-center">
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
        <div className="signup-info-card bg-card rounded-2xl border border-gray-200 p-8 max-w-4xl mx-auto">
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