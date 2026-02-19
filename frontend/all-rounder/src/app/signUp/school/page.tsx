"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  School,
  Mail,
  Lock,
  MapPin,
  Phone,
  Globe,
  Upload,
  FileType2,
  FileImage,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
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

export default function SchoolSignup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: "",
    schoolType: "",
    establishedYear: "",
    registrationNumber: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    adminName: "",
    adminTitle: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    confirmPassword: "",
  });

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const allowed = Array.from(newFiles).filter((f) =>
      ["application/pdf", "image/jpeg", "image/png"].includes(f.type)
    );
    setUploadedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...allowed.filter((f) => !existing.has(f.name + f.size))];
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf")
      return <FileType2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary-blue)" }} />;
    return <FileImage className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary-purple)" }} />;
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      if (uploadedFiles.length === 0) return;
      alert("School account created! Your registration is under review.");
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
            School Registration
          </h1>
          <p className="text-muted text-sm max-w-[280px]">
            Register your institution on{" "}
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
                      ? { background: "var(--primary-dark-purple)", color: "#fff" }
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
                        ? { background: "var(--primary-dark-purple)" }
                        : { background: "#D1D5DB" }
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-muted">
            <span>Institution</span>
            <span>Contact</span>
            <span>Administrator</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl shadow-2xl p-8 border border-secondary-lavender">
          <form onSubmit={handleSubmit}>

            {/* ── Step 1: Institution Information ── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Institution Information
                  <span className="block h-1 w-1/2 bg-primary-blue mx-auto mt-1 rounded-full" />
                </h3>

                <div>
                  <label className={labelClass}>School/Institution Name *</label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => updateField("schoolName", e.target.value)}
                      className={iconInputClass}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>School Type *</label>
                    <select
                      value={formData.schoolType}
                      onChange={(e) => updateField("schoolType", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
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
                    <label className={labelClass}>Year Established *</label>
                    <input
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => updateField("establishedYear", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      placeholder="e.g., 1990"
                      min="1800"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Registration Number *</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => updateField("registrationNumber", e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="Official registration/license number"
                    required
                  />
                </div>

                {/* Passwords */}
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
                          if (formData.confirmPassword && formData.confirmPassword !== e.target.value) {
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
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Contact Information ── */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Contact Information
                  <span className="block h-1 w-1/2 bg-primary-blue mx-auto mt-1 rounded-full" />
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Official Email *</label>
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
                </div>

                <div>
                  <label className={labelClass}>Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      className={iconInputClass}
                      style={inputStyle}
                      placeholder="https://www.yourschool.edu"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Street Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700"
                      style={inputStyle}
                      rows={2}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => updateField("zipCode", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Administrator Information ── */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Administrator Information
                  <span className="block h-1 w-1/2 bg-primary-blue mx-auto mt-1 rounded-full" />
                </h3>

                <div
                  className="p-4 border rounded-lg mb-4"
                  style={{
                    background: "var(--secondary-pale-lavender)",
                    borderColor: "var(--secondary-light-lavender)",
                  }}
                >
                  <p className="text-sm text-gray-700">
                    Please provide details of the school administrator who will manage this account.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Administrator Name *</label>
                    <input
                      type="text"
                      value={formData.adminName}
                      onChange={(e) => updateField("adminName", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Title/Position *</label>
                    <input
                      type="text"
                      value={formData.adminTitle}
                      onChange={(e) => updateField("adminTitle", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      placeholder="e.g., Principal, Dean"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Administrator Email *</label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => updateField("adminEmail", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Administrator Phone *</label>
                    <input
                      type="tel"
                      value={formData.adminPhone}
                      onChange={(e) => updateField("adminPhone", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass + " mb-0"}>Upload Official Documentation *</label>
                    {uploadedFiles.length > 0 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--secondary-pale-lavender)", color: "var(--primary-purple)" }}>
                        {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} added
                      </span>
                    )}
                  </div>

                  {/* Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className="rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: dragOver ? "var(--primary-purple)" : "var(--secondary-light-lavender)",
                      background: dragOver ? "var(--secondary-pale-lavender)" : "transparent",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => addFiles(e.target.files)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      multiple
                    />
                    <div className="flex flex-col items-center gap-2 py-8 px-4 select-none">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
                        style={{ background: "var(--secondary-pale-lavender)" }}
                      >
                        <Upload className="w-6 h-6" style={{ color: "var(--primary-purple)" }} />
                      </div>
                      <p className="text-sm font-medium text-primary-dark">
                        {dragOver ? "Drop files here" : "Drag & drop or click to browse"}
                      </p>
                      <p className="text-xs text-muted text-center max-w-xs">
                        School registration or license documents
                      </p>
                      <p className="text-xs text-muted">PDF, JPG or PNG · max 10 MB each</p>
                      <div
                        className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                        style={{ background: "var(--secondary-pale-lavender)", color: "var(--primary-purple)" }}
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add files
                      </div>
                    </div>
                  </div>

                  {/* File List */}
                  {uploadedFiles.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {uploadedFiles.map((file, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                          style={{
                            background: "var(--secondary-pale-lavender)",
                            borderColor: "var(--secondary-light-lavender)",
                          }}
                        >
                          {/* Icon */}
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "var(--secondary-light-lavender)" }}
                          >
                            {getFileIcon(file)}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-dark truncate">{file.name}</p>
                            <p className="text-xs text-muted">{formatBytes(file.size)}</p>
                          </div>

                          {/* Uploaded badge */}
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-50 group"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Validation hint */}
                  {uploadedFiles.length === 0 && (
                    <p className="text-xs text-muted mt-2">At least one document is required.</p>
                  )}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🔒 Your registration will be verified within 2-3 business days. You'll receive
                    confirmation via email once approved.
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
                style={{ background: "var(--primary-dark-purple)" }}
              >
                {currentStep === 3 ? "Submit for Verification" : "Next"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Already registered?{" "}
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