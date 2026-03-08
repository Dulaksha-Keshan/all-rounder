"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { useUserStore } from "@/context/useUserStore";

function PageBackground() {
  const starsRef = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* === Gradient Orbs === */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--primary-purple)" }}
      />
      <div
        className="absolute -top-20 right-0 w-[380px] h-[380px] rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--primary-blue)" }}
      />
      <div
        className="absolute bottom-0 -right-24 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--secondary-light-lavender)" }}
      />
      <div
        className="absolute -bottom-20 left-10 w-[300px] h-[300px] rounded-full opacity-20 blur-2xl"
        style={{ background: "var(--primary-dark-purple)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--secondary-purple-light)" }}
      />

      {/* === Stars === */}
      <div ref={(el) => { starsRef.current[0] = el; }} className="absolute top-10 sm:top-20 left-5 sm:left-10 text-3xl sm:text-4xl lg:text-5xl opacity-40" style={{ color: "var(--primary-dark-purple)" }}>★</div>
      <div ref={(el) => { starsRef.current[1] = el; }} className="absolute top-20 sm:top-32 right-10 sm:right-20 text-2xl sm:text-3xl lg:text-4xl opacity-30" style={{ color: "var(--primary-dark-purple)" }}>★</div>
      <div ref={(el) => { starsRef.current[2] = el; }} className="absolute bottom-20 sm:bottom-32 left-16 sm:left-32 text-4xl sm:text-5xl lg:text-6xl opacity-25" style={{ color: "var(--primary-dark-purple)" }}>★</div>
      <div ref={(el) => { starsRef.current[3] = el; }} className="absolute top-1/3 right-16 sm:right-32 text-3xl sm:text-4xl lg:text-5xl opacity-35" style={{ color: "var(--primary-dark-purple)" }}>★</div>
      <div ref={(el) => { starsRef.current[4] = el; }} className="absolute bottom-10 sm:bottom-20 right-6 sm:right-12 text-2xl sm:text-3xl lg:text-4xl opacity-30" style={{ color: "var(--primary-dark-purple)" }}>★</div>
      <div ref={(el) => { starsRef.current[5] = el; }} className="absolute top-1/2 left-10 sm:left-20 text-xl sm:text-2xl lg:text-3xl opacity-25" style={{ color: "var(--primary-dark-purple)" }}>★</div>
      <div ref={(el) => { starsRef.current[6] = el; }} className="absolute top-1/4 left-1/4 text-2xl sm:text-3xl opacity-20" style={{ color: "var(--primary-dark-purple)" }}>★</div>
      <div ref={(el) => { starsRef.current[7] = el; }} className="absolute bottom-1/3 right-1/4 text-xl sm:text-2xl opacity-20" style={{ color: "var(--primary-dark-purple)" }}>★</div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  // 1. Pulled Google Login out here as per best practices!
  const loginWithEmail = useUserStore((state) => state.loginWithEmail);
  const loginWithGoogle = useUserStore((state) => state.loginWithGoogle);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);

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

  return (
    <div
      className="min-h-screen py-40 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--secondary-pale-lavender) 0%, var(--secondary-light-lavender) 50%, var(--secondary-pale-lavender) 100%)",
      }}
    >
      <PageBackground />

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
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
        <div className="bg-card rounded-xl shadow-2xl p-8 border border-secondary-lavender">

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

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
        <div className="mt-6 text-center">
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