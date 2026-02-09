"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "verify" | "reset" | "success">(
    "email"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-page-bg">
      {/* Decorative Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl bg-primary-gradient/30" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-primary-gradient/20" />

      {/* Floating Sparkles */}
      <Sparkles className="absolute top-10 left-10 w-6 h-6 text-primary-purple opacity-30 animate-pulse" />
      <Sparkles className="absolute top-32 right-20 w-5 h-5 text-primary-purple opacity-20 animate-pulse" />
      <Sparkles className="absolute bottom-24 left-1/4 w-8 h-8 text-primary-purple opacity-20 animate-pulse" />

      <div className="relative z-10 max-w-md mx-auto py-14 px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Image
              src="/icons/logoForPages.png"
              alt="Login Icon"
              width={80}
              height={80}
            />
          </div>

          <h1 className="text-2xl font-bold text-main mb-2">
            {step === "email" && "Forgot Password?"}
            {step === "verify" && "Verify Your Email"}
            {step === "reset" && "Reset Password"}
            {step === "success" && "Success!"}
          </h1>

          <p className="text-muted text-sm">
            {step === "email" && "We'll help you recover access to your account"}
            {step === "verify" && "Enter the verification code we sent you"}
            {step === "reset" && "Choose a strong new password"}
            {step === "success" &&
              "Your password has been reset successfully"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-secondary-lavender">
          {/* STEP 1 */}
          {step === "email" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("verify");
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm text-main mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-page-bg border border-gray-300 focus:ring-2 focus:ring-primary-purple focus:outline-none"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <button className="w-full py-3 rounded-lg bg-primary-gradient text-white font-medium">
                Send Verification Code
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-accent hover:text-primary-purple"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </form>
          )}

          {/* STEP 2 */}
          {step === "verify" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("reset");
              }}
              className="space-y-6"
            >
              <div className="bg-page-bg p-4 rounded-lg border border-secondary-lavender text-center">
                <p className="text-sm text-muted">
                  Code sent to
                  <br />
                  <span className="font-medium text-main">
                    {formData.email}
                  </span>
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                required
                className="w-full text-center tracking-widest text-xl py-3 rounded-lg bg-page-bg border border-gray-300 focus:ring-2 focus:ring-primary-purple"
                placeholder="000000"
              />

              <button className="w-full py-3 rounded-lg bg-primary-gradient text-white font-medium">
                Verify Code
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === "reset" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (formData.newPassword !== formData.confirmPassword) {
                  setPasswordError("Passwords do not match");
                  return;
                }

                setPasswordError("");
                setStep("success");
              }}
              className="space-y-6"
            >
              {/* New Password */}
              <div>
                <label className="block text-sm text-main mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-page-bg border border-gray-300 focus:ring-2 focus:ring-primary-purple"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-main mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-page-bg border border-gray-300 focus:ring-2 focus:ring-primary-purple"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      const value = e.target.value;

                      setFormData({
                        ...formData,
                        confirmPassword: value,
                      });

                      if (
                        formData.newPassword &&
                        value !== formData.newPassword
                      ) {
                        setPasswordError("Passwords do not match");
                      } else {
                        setPasswordError("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">
                    {passwordError}
                  </p>
                )}
              </div>

              <button className="w-full py-3 rounded-lg bg-primary-gradient text-white font-medium">
                Reset Password
              </button>
            </form>
          )}

          {/* STEP 4 */}
          {step === "success" && (
            <div className="text-center space-y-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-main font-medium">
                Your password has been reset successfully.
              </p>

              <Link
                href="/login"
                className="block w-full py-3 rounded-lg bg-primary-gradient text-white text-center"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
