"use client";

import { useState } from "react";
import Link from "next/link";
import { School, Mail, Lock, MapPin, Phone, Globe, Upload, FileText, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function SchoolSignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Institution Information
    schoolName: "",
    schoolType: "",
    establishedYear: "",
    registrationNumber: "",

    // Contact Information
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Administrator Information
    adminName: "",
    adminTitle: "",
    adminEmail: "",
    adminPhone: "",

    // Account Security
    password: "",
    confirmPassword: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Password matching validation
    if (
      currentStep === 1 &&
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
      alert("School account created! Your registration is under review.");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FF] to-[#DCD0FF] py-12 px-4">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-[#34365C] mb-2">School Registration</h1>
          <p className="text-gray-600">Register your institution on All-Rounder</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-[#34365C] text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 ${
                      step < currentStep ? "bg-[#34365C]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-gray-600">
            <span>Institution</span>
            <span>Contact</span>
            <span>Administrator</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Institution Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Institution Information</h3>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">School/Institution Name *</label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => updateField("schoolName", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">School Type *</label>
                    <select
                      value={formData.schoolType}
                      onChange={(e) => updateField("schoolType", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="public">Public School</option>
                      <option value="private">Private School</option>
                      <option value="charter">Charter School</option>
                      <option value="international">International School</option>
                      <option value="vocational">Vocational Institute</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Year Established *</label>
                    <input
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => updateField("establishedYear", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      placeholder="e.g., 1990"
                      min="1800"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Registration Number *</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => updateField("registrationNumber", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                    placeholder="Official registration/license number"
                    required
                  />
                </div>

                {/* Passwords with eye toggle */}
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
                          if (formData.confirmPassword && formData.confirmPassword !== e.target.value) {
                            setPasswordError("Passwords do not match");
                          } else {
                            setPasswordError("");
                          }
                        }}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
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
                        className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Contact Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Official Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      placeholder="https://www.yourschool.edu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Street Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      rows={2}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => updateField("zipCode", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Administrator Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Administrator Information</h3>

                <div className="p-4 bg-[#F8F8FF] border border-[#DCD0FF] rounded-lg mb-4">
                  <p className="text-sm text-gray-700">
                    Please provide details of the school administrator who will manage this account.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Administrator Name *</label>
                    <input
                      type="text"
                      value={formData.adminName}
                      onChange={(e) => updateField("adminName", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Title/Position *</label>
                    <input
                      type="text"
                      value={formData.adminTitle}
                      onChange={(e) => updateField("adminTitle", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      placeholder="e.g., Principal, Dean"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Administrator Email *</label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => updateField("adminEmail", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Administrator Phone *</label>
                    <input
                      type="tel"
                      value={formData.adminPhone}
                      onChange={(e) => updateField("adminPhone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34365C]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Upload Official Documentation *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#34365C] transition">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      {uploadedFile ? (
                        <div className="flex items-center justify-center gap-2 text-[#34365C]">
                          <FileText className="w-5 h-5" />
                          <span>{uploadedFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-600">Upload school registration or license</p>
                          <p className="text-sm text-gray-500 mt-1">PDF, JPG, or PNG (max 10MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🔒 Your registration will be verified within 2-3 business days. 
                    You'll receive confirmation via email once approved.
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
                className="flex-1 py-3 bg-[#34365C] text-white rounded-lg hover:bg-[#252745] transition"
              >
                {currentStep === 3 ? "Submit for Verification" : "Next"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already registered?{" "}
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
