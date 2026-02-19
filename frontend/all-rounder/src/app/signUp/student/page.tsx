"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Calendar, School, Phone, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

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

export default function StudentSignup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    schoolName: "",
    grade: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    teacherEmail: "",
    teacherName: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      currentStep === 2 &&
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Student account created! Awaiting teacher verification.");
      router.push("/login");
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700";
  const inputStyle = { "--tw-ring-color": "var(--primary-purple)" } as React.CSSProperties;
  const iconInputClass =
    "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700";
  const labelClass = "block text-sm mb-2 text-primary-dark";

  return (
    <div
      className="min-h-screen py-40 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--secondary-pale-lavender) 0%, var(--secondary-light-lavender) 50%, var(--secondary-pale-lavender) 100%)",
      }}
    >
      <PageBackground />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-6">
            <Image
              src="/icons/logoForPages.png"
              alt="Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <h1 className="text-primary-dark text-3xl font-bold tracking-tight mb-2">
            Student Registration
          </h1>
          <p className="text-muted text-sm max-w-[280px]">
            Create your talent portfolio account on<br />
            <span className="font-semibold" style={{ color: "var(--primary-blue)" }}>
              All-Rounder
            </span>
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors"
                  style={
                    step <= currentStep
                      ? { background: "var(--primary-purple)", color: "#fff" }
                      : { background: "#D1D5DB", color: "#6B7280" }
                  }
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className="w-20 h-1 transition-colors"
                    style={
                      step < currentStep
                        ? { background: "var(--primary-purple)" }
                        : { background: "#D1D5DB" }
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-muted">
            <span>Personal</span>
            <span>Academic</span>
            <span>Verification</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl shadow-2xl p-8 border border-secondary-lavender">
          <form onSubmit={handleSubmit}>

            {/* ── Step 1: Personal Information ── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">
                  Personal Information
                  <span className="block h-1 w-1/2 mx-auto mt-2 rounded-full" style={{ background: "var(--primary-blue)" }} />
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className={iconInputClass}
                        style={inputStyle}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={iconInputClass}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={iconInputClass}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateField("dateOfBirth", e.target.value)}
                        className={iconInputClass}
                        style={inputStyle}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                    >
                      <option value="" disabled>Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Academic & Password Information ── */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">
                  Academic Information
                  <span className="block h-1 w-1/2 mx-auto mt-2 rounded-full" style={{ background: "var(--primary-blue)" }} />
                </h3>

                <div>
                  <label className={labelClass}>School Name *</label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => updateField("schoolName", e.target.value)}
                      className={iconInputClass}
                      style={inputStyle}
                      placeholder="Enter your school name"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Grade/Class *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => updateField("grade", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                    >
                      <option value="">Select Grade</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Grade {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Student ID</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => updateField("studentId", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => {
                          updateField("password", e.target.value);
                          if (formData.confirmPassword && e.target.value !== formData.confirmPassword) {
                            setPasswordError("Passwords do not match");
                          } else {
                            setPasswordError("");
                          }
                        }}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700"
                        style={inputStyle}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          updateField("confirmPassword", e.target.value);
                          if (formData.password && e.target.value !== formData.password) {
                            setPasswordError("Passwords do not match");
                          } else {
                            setPasswordError("");
                          }
                        }}
                        className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700"
                        style={inputStyle}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Teacher Verification ── */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">
                  Teacher Verification
                  <span className="block h-1 w-1/2 mx-auto mt-2 rounded-full" style={{ background: "var(--primary-blue)" }} />
                </h3>

                <div
                  className="p-4 border rounded-lg mb-4"
                  style={{
                    background: "var(--secondary-pale-lavender)",
                    borderColor: "var(--secondary-light-lavender)",
                  }}
                >
                  <p className="text-sm text-gray-700">
                    To complete your registration, a verified teacher from your school must approve your account.
                    Please provide your teacher's information below.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Teacher's Full Name *</label>
                  <input
                    type="text"
                    value={formData.teacherName}
                    onChange={(e) => updateField("teacherName", e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="Enter your teacher's name"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Teacher's Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.teacherEmail}
                      onChange={(e) => updateField("teacherEmail", e.target.value)}
                      className={iconInputClass}
                      style={inputStyle}
                      placeholder="teacher@school.edu"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📧 A verification request will be sent to your teacher. You'll be able to access your account
                    once they approve your request.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3 text-white rounded-lg font-medium hover:opacity-90 transition shadow-md hover:shadow-lg"
                style={{ background: "var(--primary-purple)" }}
              >
                {currentStep === 3 ? "Submit for Verification" : "Next"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium hover:underline"
                style={{ color: "var(--primary-blue)" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}