"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  School,
  Upload,
  FileType2,
  FileImage,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  PlusCircle,
  ChevronDown,
  Calendar,
  Phone,
  Briefcase,
  BookOpen
} from "lucide-react";
import Image from "next/image";

import { useUserStore } from "@/context/useUserStore";
import { useSchoolStore } from "@/context/useSchoolStore";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useToastStore } from "@/context/useToastStore";

function PageBackground() {
  const starsRef = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl" style={{ background: "var(--primary-purple)" }} />
      <div className="absolute -top-20 right-0 w-[380px] h-[380px] rounded-full opacity-20 blur-3xl" style={{ background: "var(--primary-blue)" }} />
      <div className="absolute bottom-0 -right-24 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl" style={{ background: "var(--secondary-light-lavender)" }} />
      <div className="absolute -bottom-20 left-10 w-[300px] h-[300px] rounded-full opacity-20 blur-2xl" style={{ background: "var(--primary-dark-purple)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl" style={{ background: "var(--secondary-purple-light)" }} />

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

export default function TeacherSignup() {
  const router = useRouter();
  
  const registerWithEmail = useUserStore((state) => state.registerWithEmail);
  const registerWithGoogle = useUserStore((state) => state.registerWithGoogle);
  const isAuthLoading = useUserStore((state) => state.isLoading);
  const authError = useUserStore((state) => state.error);
  const showToast = useToastStore((state) => state.showToast);
  const { schools, fetchSchools } = useSchoolStore();

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  useEffect(() => {
    if (!authError) return;
    showToast(authError, "error");
  }, [authError, showToast]);

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [schoolSearchTerm, setSchoolSearchTerm] = useState("");
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);

  // Aligned strictly to your backend Prisma schema
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "", 
    dateOfBirth: "", 
    schoolId: "",
    subject: "",
    grade: "",
    designation: "",
    staffId: "",
    password: "",
    confirmPassword: "",
    verificationType: "DOCUMENT",
    googleIdToken: "",
  });

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const allowed = Array.from(newFiles).filter((f) =>
      ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(f.type) && f.size <= 5 * 1024 * 1024
    );
    setUploadedFiles(allowed.length > 0 ? [allowed[0]] : []);
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

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(schoolSearchTerm.toLowerCase())
  );

  const isStep1Valid = Boolean(
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.dateOfBirth &&
    (isGoogleFlow || (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword))
  );

  const isStep2Valid = Boolean(
    formData.schoolId &&
    (() => {
      const grade = Number(formData.grade);
      return Number.isFinite(grade) && grade >= 6 && grade <= 13;
    })()
  );
  const isStep3Valid = formData.verificationType === "ADMIN_APPROVAL" || uploadedFiles.length > 0;
  const isCurrentStepValid = currentStep === 1 ? isStep1Valid : currentStep === 2 ? isStep2Valid : isStep3Valid;

  const handleGoogleInitiate = async () => {
    try {
      if (!auth || !googleProvider) {
        throw new Error("Google sign-in is not configured.");
      }

      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      const displayName = result.user.displayName || "";
      const nameParts = displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email: result.user.email || "",
        googleIdToken: token
      }));
      
      setIsGoogleFlow(true);
      setCurrentStep(1);
    } catch (error) {
      console.error("Google Initiation failed", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCurrentStepValid) {
      return;
    }

    if (currentStep === 1 && !isGoogleFlow) {
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
    }

    if (currentStep === 2 && !formData.schoolId) {
      setPasswordError("Please select a valid school from the dropdown list.");
      return;
    }

    setPasswordError("");

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (formData.verificationType === "DOCUMENT" && uploadedFiles.length === 0) {
        setPasswordError("Please upload a verification document.");
        return;
      }

      try {
        const payload = new FormData();
        
        payload.append("name", `${formData.firstName} ${formData.lastName}`.trim());
        payload.append("email", formData.email);
        payload.append("dateOfBirth", formData.dateOfBirth);
        if (formData.phone) payload.append("contact_number", formData.phone);
        
        payload.append("role", "TEACHER");
        payload.append("authProvider", isGoogleFlow ? "GOOGLE" : "EMAIL");
        payload.append("schoolId", formData.schoolId);
        payload.append("verificationOption", formData.verificationType);
        
        if (formData.subject) payload.append("subject", formData.subject);
        if (formData.grade) payload.append("grade", formData.grade);
        if (formData.designation) payload.append("designation", formData.designation);
        if (formData.staffId) payload.append("staff_id", formData.staffId);

        if (isGoogleFlow) {
          payload.append("idtoken", formData.googleIdToken);
        } else {
          payload.append("password", formData.password);
        }

        console.log(uploadedFiles.length)
        if (formData.verificationType === "DOCUMENT" && uploadedFiles[0]) {
          payload.append("verificationAttachment", uploadedFiles[0]);
        }

        if (isGoogleFlow) {
          await registerWithGoogle(payload);
        } else {
          await registerWithEmail(payload);
        }

        if (!useUserStore.getState().error) {
          showToast("Teacher account created! Your verification documents are under review.", "success");
          router.push("/login");
        }
      } catch (err) {
        console.error("Registration failed", err);
        showToast("Registration failed. Please try again.", "error");
      }
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700";
  const inputStyle = { "--tw-ring-color": "var(--primary-blue)" } as React.CSSProperties;
  const iconInputClass = "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700";
  const labelClass = "block text-sm mb-2 text-primary-dark";

  return (
    <div className="min-h-screen py-40 px-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--secondary-pale-lavender) 0%, var(--secondary-light-lavender) 50%, var(--secondary-pale-lavender) 100%)" }}>
      <PageBackground />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-6"><Image src="/icons/logoForPages.png" alt="Logo" width={80} height={80} priority /></div>
          <h1 className="text-primary-dark text-3xl font-bold tracking-tight mb-2">Teacher Registration</h1>
          <p className="text-muted text-sm max-w-[280px]">Join as a verified educator on <span className="font-semibold" style={{ color: "var(--primary-blue)" }}>All-Rounder</span></p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors" style={step <= currentStep ? { background: "var(--primary-blue)", color: "#fff" } : { background: "#D1D5DB", color: "#6B7280" }}>{step}</div>
                {step < 3 && <div className="w-20 h-1 transition-colors" style={step < currentStep ? { background: "var(--primary-blue)" } : { background: "#D1D5DB" }} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-muted">
            <span>Personal</span><span>Professional</span><span>Verification</span>
          </div>
        </div>

        <div className="surface-readable-strong rounded-xl p-8">

          <form onSubmit={handleSubmit}>

            {/* ── Step 1: Personal Information ── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                
                <button type="button" onClick={handleGoogleInitiate} className="w-full mb-6 py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition bg-white text-gray-700 font-medium shadow-sm">
                  <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                  Continue with Google
                </button>

                <div className="flex items-center justify-between mb-6">
                  <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
                  <p className="text-xs text-center text-gray-500 uppercase">or register with email</p>
                  <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
                </div>

                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Personal Information<span className="block h-1 w-1/2 mx-auto mt-2 rounded-full" style={{ background: "var(--primary-blue)" }} /></h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} className={iconInputClass} style={inputStyle} required />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input type="text" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} className={inputClass} style={inputStyle} required />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={iconInputClass} style={inputStyle} placeholder="teacher@school.edu" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className={iconInputClass} style={inputStyle} required />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className={iconInputClass} style={inputStyle} required placeholder="YYYY-MM-DD" title="Date of birth (YYYY-MM-DD)" />
                    </div>
                  </div>
                </div>

                {!isGoogleFlow && (
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
                            } else { setPasswordError(""); }
                          }}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700"
                          style={inputStyle}
                          required={!isGoogleFlow}
                        />
                        <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
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
                            } else { setPasswordError(""); }
                          }}
                          className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700"
                          style={inputStyle}
                          required={!isGoogleFlow}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                          {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 2: Professional Information ── */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Professional Information<span className="block h-1 w-1/2 mx-auto mt-2 rounded-full" style={{ background: "var(--primary-blue)" }} /></h3>

                <div className="relative">
                  <label className={labelClass}>School/Institution Name *</label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <input
                      type="text"
                      value={schoolSearchTerm}
                      onChange={(e) => {
                        setSchoolSearchTerm(e.target.value);
                        setIsSchoolDropdownOpen(true);
                        if (formData.schoolId) updateField("schoolId", "");
                      }}
                      onFocus={() => setIsSchoolDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsSchoolDropdownOpen(false), 200)}
                      className={`${iconInputClass} pr-10 cursor-text bg-white`}
                      style={inputStyle}
                      placeholder="Search for your school..."
                      required
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {isSchoolDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {filteredSchools.length > 0 ? (
                        filteredSchools.map((school) => (
                          <div
                            key={school.school_id}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${formData.schoolId === school.school_id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                            onMouseDown={(e) => {
                              e.preventDefault(); 
                              updateField("schoolId", school.school_id);
                              setSchoolSearchTerm(school.name);
                              setIsSchoolDropdownOpen(false);
                            }}
                          >
                            {school.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 italic text-center">No schools found. Please contact support if your school is missing.</div>
                      )}
                    </div>
                  )}
                  {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Subject / Specialization</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={formData.subject} onChange={(e) => updateField("subject", e.target.value)} className={iconInputClass} style={inputStyle} placeholder="e.g., Mathematics" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Grade Taught *</label>
                    <select value={formData.grade} onChange={(e) => updateField("grade", e.target.value)} className={inputClass} style={inputStyle} required>
                      <option value="">Select Grade</option>
                      {Array.from({ length: 8 }, (_, i) => i + 6).map((grade) => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Designation</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={formData.designation} onChange={(e) => updateField("designation", e.target.value)} className={iconInputClass} style={inputStyle} placeholder="e.g., Senior Lecturer" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Staff ID</label>
                    <input type="text" value={formData.staffId} onChange={(e) => updateField("staffId", e.target.value)} className={inputClass} style={inputStyle} placeholder="Optional" />
                  </div>
                </div>

              </div>
            )}

            {/* ── Step 3: Employment Verification ── */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Employment Verification<span className="block h-1 w-1/2 mx-auto mt-2 rounded-full" style={{ background: "var(--primary-blue)" }} /></h3>
                
                <div className="p-4 border rounded-lg mb-4" style={{ background: "var(--secondary-pale-lavender)", borderColor: "var(--secondary-light-lavender)" }}>
                  <p className="text-sm text-gray-700">To gain "Verified Teacher" status, please upload proof of employment. This can be:</p>
                  <ul className="text-sm text-gray-700 ml-4 mt-2 list-disc">
                    <li>Staff ID Card (photo or scan)</li>
                    <li>Official Appointment Letter</li>
                    <li>Employment Contract</li>
                  </ul>
                </div>

                <div>
                  <label className={labelClass}>Verification Method *</label>
                  <select value={formData.verificationType} onChange={(e) => updateField("verificationType", e.target.value)} className={inputClass} style={inputStyle} required>
                    <option value="DOCUMENT">Upload Document</option>
                    <option value="ADMIN_APPROVAL">Request School/Admin Approval</option>
                  </select>
                </div>

                {formData.verificationType === "DOCUMENT" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass + " mb-0"}>Upload Document(s) *</label>
                    {uploadedFiles.length > 0 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--secondary-pale-lavender)", color: "var(--primary-blue)" }}>
                        1 file selected
                      </span>
                    )}
                  </div>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className="rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: dragOver ? "var(--primary-blue)" : "var(--secondary-light-lavender)",
                      background: dragOver ? "var(--secondary-pale-lavender)" : "transparent",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input ref={fileInputRef} type="file" onChange={(e) => addFiles(e.target.files)} accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" />
                    <div className="flex flex-col items-center gap-2 py-8 px-4 select-none">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1" style={{ background: "var(--secondary-pale-lavender)" }}>
                        <Upload className="w-6 h-6" style={{ color: "var(--primary-blue)" }} />
                      </div>
                      <p className="text-sm font-medium text-primary-dark">{dragOver ? "Drop files here" : "Drag & drop or click to browse"}</p>
                      <p className="text-xs text-muted text-center max-w-xs">Staff ID, appointment letter, or employment contract</p>
                      <p className="text-xs text-muted">PDF, JPG, PNG or WEBP · max 5 MB</p>
                      <div className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5" style={{ background: "var(--secondary-pale-lavender)", color: "var(--primary-blue)" }}>
                        <PlusCircle className="w-3.5 h-3.5" /> Choose file
                      </div>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {uploadedFiles.map((file, i) => (
                        <li key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all" style={{ background: "var(--secondary-pale-lavender)", borderColor: "var(--secondary-light-lavender)" }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--secondary-light-lavender)" }}>
                            {getFileIcon(file)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-dark truncate">{file.name}</p>
                            <p className="text-xs text-muted">{formatBytes(file.size)}</p>
                          </div>
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-50 group">
                            <X className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {uploadedFiles.length === 0 && <p className="text-xs text-muted mt-2">At least one document is required.</p>}
                </div>
                )}

                {formData.verificationType === "ADMIN_APPROVAL" && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">Your registration will be sent for school/admin approval. No document upload is required for this method.</p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">🔒 Your documents will be reviewed by our verification team within 24-48 hours. You'll receive an email once your account is verified.</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)} disabled={isAuthLoading} className="flex-1 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">Back</button>
              )}
              <button type="submit" disabled={isAuthLoading || !isCurrentStepValid} className="flex-1 py-3 text-white rounded-lg font-medium hover:opacity-90 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: "var(--primary-blue)" }}>
                {isAuthLoading && currentStep === 3 ? "Creating Account..." : (currentStep === 3 ? "Submit for Verification" : "Next")}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">Already have an account? <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--primary-blue)" }}>Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}