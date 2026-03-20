"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import gsap from "gsap";

import { useUserStore } from "@/context/useUserStore";
import { useToastStore } from "@/context/useToastStore";

export default function LoginPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  // 1. Pulled Google Login out here as per best practices!
  const loginWithEmail = useUserStore((state) => state.loginWithEmail);
  const loginWithGoogle = useUserStore((state) => state.loginWithGoogle);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);
  const showToast = useToastStore((state) => state.showToast);

  const [showPassword, setShowPassword] = useState(false);
  
  // 2. Removed the 2FA state completely
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginWithEmail(formData.email, formData.password);

      // FIX: Check the store directly to see if an error was saved during the await
      // If there is NO error, then we redirect safely.
      if (!useUserStore.getState().error) {
        router.push("/home");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  useEffect(() => {
    if (!error) return;
    showToast(error, "error");
  }, [error, showToast]);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      const stars = gsap.utils.toArray<HTMLElement>(".auth-stars > div");
      const orbs = gsap.utils.toArray<HTMLElement>(".auth-orb");

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from(".auth-hero", { y: 24, opacity: 0, duration: 0.7 })
        .from(".auth-card", { y: 28, opacity: 0, duration: 0.75 }, "-=0.3")
        .from(".auth-extra", { y: 16, opacity: 0, duration: 0.5 }, "-=0.25");

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
      className="min-h-screen py-40 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--secondary-pale-lavender) 0%, var(--secondary-light-lavender) 25%, #ffffff 50%, var(--secondary-light-lavender) 75%, var(--secondary-pale-lavender) 100%)",
      }}
    >
      {/* Colorful Gradient Orbs - Same style as sign-up main page */}
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

      {/* Beautiful Star Field Background - Same style as sign-up main page */}
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

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="auth-hero flex flex-col items-center text-center mb-8">
          <div className="mb-8">
            <Image
              src="/icons/logoForPages.png"
              alt="Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          {/* Header Text */}
          <h1 className="text-primary-dark text-3xl font-bold tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-muted text-sm max-w-[250px]">
            Sign in to continue to <span className="text-primary-blue font-semibold">All-Rounder</span>
          </p>
        </div>

        {/* Login Form */}
        <div className="auth-card bg-card rounded-xl shadow-2xl p-8 border border-secondary-lavender">

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-primary-dark">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700"
                style={{ "--tw-ring-color": "var(--primary-purple)" } as React.CSSProperties}
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm mb-2 text-primary-dark">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 pr-12"
                  style={{ "--tw-ring-color": "var(--primary-purple)" } as React.CSSProperties}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "var(--primary-blue)" }}
            >
              {isLoading ? "Signing in..." : "Continue"}
            </button>
          </form> 
          {/* 3. MOVED FORM CLOSING TAG UP HERE */}

          {/* Google Sign In Divider */}
          <div className="mt-6 flex items-center justify-between">
            <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
            <p className="text-xs text-center text-gray-500 uppercase">or login with</p>
            <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            // 4. Using the extracted hook and passing undefined!
            onClick={() => loginWithGoogle(undefined as any)} 
            className="w-full mt-6 py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition bg-white text-gray-700 font-medium shadow-sm"
          >
            <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
            Google
          </button>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link
              href="/login/forgot-password"
              className="text-sm hover:underline"
              style={{ color: "var(--primary-blue)" }}
            >
              Forgot your password?
            </Link>
          </div>

          {/* Sign Up */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-muted text-center">
              Don't have an account?{" "}
              <Link
                href="/signUp"
                className="font-medium hover:underline"
                style={{ color: "var(--primary-blue)" }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Help */}
        <div className="auth-extra mt-6 text-center">
          <p className="text-sm text-muted">
            Need help?{" "}
            <Link href="/faq" className="hover:underline" style={{ color: "var(--primary-blue)" }}>
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}