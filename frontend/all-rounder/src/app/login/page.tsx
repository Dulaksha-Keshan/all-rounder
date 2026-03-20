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
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from(".auth-hero", { y: 24, opacity: 0, duration: 0.7 })
        .from(".auth-card", { y: 28, opacity: 0, duration: 0.75 }, "-=0.3")
        .from(".auth-extra", { y: 16, opacity: 0, duration: 0.5 }, "-=0.25");
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-[calc(100vh-6rem)] py-10 md:py-12 px-4 relative flex items-start"
    >

      <div className="max-w-xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="auth-hero flex flex-col items-center text-center mb-6">
          <div className="mb-6">
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
        <div className="auth-card surface-readable-strong rounded-xl p-8 md:p-10">

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