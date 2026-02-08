"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Calendar, School, Phone, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function StudentSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",

    // Academic Information
    schoolName: "",
    grade: "",
    studentId: "",

    // Account Security
    password: "",
    confirmPassword: "",

    // Verification
    teacherEmail: "",
    teacherName: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation for step 2
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
      // Submit form logic
      alert("Student account created! Awaiting teacher verification.");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FF] to-[#DCD0FF] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 flex justify-center">
                <Image
                  src="/icons/logoForPages.png"
                  alt="Login Icon"
                  width={80}
                  height={80}
                />
              </div>
            </div>
          </div>
          <h1 className="text-[#34365C] mb-2">Student Registration</h1>
          <p className="text-gray-600">Create your talent portfolio account</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-[#8387CC] text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 ${
                      step < currentStep ? "bg-[#8387CC]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-gray-600">
            <span>Personal</span>
            <span>Academic</span>
            <span>Verification</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Personal Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateField("dateOfBirth", e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
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

            {/* Step 2: Academic & Password Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Academic Information</h3>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">School Name *</label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => updateField("schoolName", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      placeholder="Enter your school name"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Grade/Class *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => updateField("grade", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    >
                      <option value="">Select Grade</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Student ID</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => updateField("studentId", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Password *</label>
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
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Confirm Password *</label>
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
                        className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Teacher Verification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Teacher Verification</h3>

                <div className="p-4 bg-[#F8F8FF] border border-[#DCD0FF] rounded-lg mb-4">
                  <p className="text-sm text-gray-700">
                    To complete your registration, a verified teacher from your school must approve your account.
                    Please provide your teacher's information below.
                  </p>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Teacher's Full Name *</label>
                  <input
                    type="text"
                    value={formData.teacherName}
                    onChange={(e) => updateField("teacherName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                    placeholder="Enter your teacher's name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Teacher's Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.teacherEmail}
                      onChange={(e) => updateField("teacherEmail", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
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
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3 bg-[#8387CC] text-white rounded-lg hover:bg-[#7276b8] transition"
              >
                {currentStep === 3 ? "Submit for Verification" : "Next"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#4169E1] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
