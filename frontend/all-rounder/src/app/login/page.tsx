"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

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

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
  });
  const [show2FA, setShow2FA] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!show2FA) {
      setShow2FA(true);
    } else {
      router.push("/home");
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
            <div>
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

            {/* Two-Factor Authentication */}
            {show2FA && (
              <div
                className="p-4 rounded-lg border border-secondary-lavender"
                style={{ background: "var(--secondary-pale-lavender)" }}
              >
                <label htmlFor="twoFactorCode" className="block text-sm mb-2 text-primary-dark">
                  Two-Factor Authentication Code
                </label>
                <input
                  type="text"
                  id="twoFactorCode"
                  value={formData.twoFactorCode}
                  onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700"
                  style={{ "--tw-ring-color": "var(--primary-purple)" } as React.CSSProperties}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted mt-2">
                  Enter the code from your authenticator app
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 text-white rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg font-medium"
              style={{ background: "var(--primary-blue)" }}
            >
              {show2FA ? "Verify & Sign In" : "Continue"}
            </button>
          </form>

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