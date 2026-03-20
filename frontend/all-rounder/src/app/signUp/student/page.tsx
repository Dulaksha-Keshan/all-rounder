"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Calendar, School, Phone, Eye, EyeOff, ChevronDown, CheckCircle2, Upload, FileType2, FileImage, X, PlusCircle } from "lucide-react";
import Image from "next/image";

import { useUserStore } from "@/context/useUserStore";
import { useSchoolStore } from "@/context/useSchoolStore";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import SkillPickerModal from "@/components/SkillPickerModal";

function PageBackground() {
  const starsRef = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl" style={{ background: "var(--primary-purple)" }} />
      <div className="absolute -top-20 right-0 w-[380px] h-[380px] rounded-full opacity-20 blur-3xl" style={{ background: "var(--primary-blue)" }} />
      <div className="absolute bottom-0 -right-24 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl" style={{ background: "var(--secondary-light-lavender)" }} />
      <div className="absolute -bottom-20 left-10 w-[300px] h-[300px] rounded-full opacity-20 blur-2xl" style={{ background: "var(--primary-dark-purple)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl" style={{ background: "var(--secondary-purple-light)" }} />
      
      {/* Stars... */}
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
  
  const registerWithEmail = useUserStore((state) => state.registerWithEmail);
  const registerWithGoogle = useUserStore((state) => state.registerWithGoogle);
  const isAuthLoading = useUserStore((state) => state.isLoading);
  const authError = useUserStore((state) => state.error);
  
  // NEW: Pull teachers and the fetch action from the store
  const { schools, fetchSchools, schoolTeachers, fetchSchoolTeachers } = useSchoolStore();

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const [currentStep, setCurrentStep] = useState(1);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSkillPickerModal, setShowSkillPickerModal] = useState(false);

  const [schoolSearchTerm, setSchoolSearchTerm] = useState("");
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  
  // NEW: Search state for the teacher dropdown
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [teacherError, setTeacherError] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isGoogleFlow, setIsGoogleFlow] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    schoolId: "", 
    grade: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    teacher_id: "", // Replaced teacherName and teacherEmail with ID
    verificationOption: "TEACHER_REQUEST",
    googleIdToken: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const filteredSchools = Array.isArray(schools) ? schools.filter(school => 
    (school.name || "").toLowerCase().includes(schoolSearchTerm.toLowerCase())
  ) : [];

  // NEW: Filter logic for teachers
  const filteredTeachers = Array.isArray(schoolTeachers) ? schoolTeachers.filter(teacher => 
    (teacher.name || "").toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
    (teacher.subject || "").toLowerCase().includes(teacherSearchTerm.toLowerCase())
  ) : [];

  const selectedSchool = schools.find((school) => school.school_id === formData.schoolId);
  const normalizedSchoolGender = String(selectedSchool?.gender || "Mixed").toLowerCase();
  const isMixedSchool = !formData.schoolId || normalizedSchoolGender === "mixed";
  const isGenderSelectionDisabled = !isMixedSchool;

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (Number.isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }
    return age;
  };

  const age = calculateAge(formData.dateOfBirth);
  const isStudentAgeValid = age !== null && age >= 13 && age <= 19;

  const isStep1Valid = Boolean(
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.dateOfBirth &&
    formData.gender &&
    isStudentAgeValid
  );

  const isStep2Valid = Boolean(
    formData.schoolId &&
    formData.grade &&
    (isGoogleFlow || (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword))
  );

  const isStep3Valid = formData.verificationOption === "TEACHER_REQUEST"
    ? Boolean(formData.teacher_id)
    : uploadedFiles.length > 0;

  const isCurrentStepValid = currentStep === 1
    ? isStep1Valid
    : currentStep === 2
      ? isStep2Valid
      : isStep3Valid;

  useEffect(() => {
    if (!formData.schoolId) return;

    if (normalizedSchoolGender === "boys" && formData.gender !== "male") {
      updateField("gender", "male");
    }

    if (normalizedSchoolGender === "girls" && formData.gender !== "female") {
      updateField("gender", "female");
    }
  }, [formData.schoolId, normalizedSchoolGender]);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter((file) => {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
      return allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
    });

    if (validFiles.length === 0) {
      setDocumentError("Please upload a valid PDF/JPEG/PNG/WEBP file up to 5 MB.");
      return;
    }

    setDocumentError("");
    setUploadedFiles([validFiles[0]]);
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
    if (file.type === "application/pdf") {
      return <FileType2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary-blue)" }} />;
    }
    return <FileImage className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary-purple)" }} />;
  };

  const handleGoogleInitiate = async () => {
    try {
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
      setCurrentStep(2); 
    } catch (error) {
      console.error("Google Initiation failed", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCurrentStepValid) {
      if (currentStep === 1 && !isStudentAgeValid) {
        setBirthDateError("Student age must be between 13 and 19 years.");
      }
      return;
    }

    setBirthDateError("");

    if (currentStep === 2) {
      if (!isGoogleFlow) {
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
          setPasswordError("Passwords do not match");
          return;
        }
      }
      if (!formData.schoolId) {
        setPasswordError("Please select a valid school from the dropdown list.");
        return;
      }
    }

    if (currentStep === 3) {
      if (formData.verificationOption === "TEACHER_REQUEST") {
        if (!formData.teacher_id) {
          setTeacherError("Please select a teacher to verify your account.");
          return;
        }
        setTeacherError("");
      }

      if (formData.verificationOption === "DOCUMENT") {
        if (uploadedFiles.length === 0) {
          setDocumentError("Please upload one verification document.");
          return;
        }
        setDocumentError("");
      }
    }

    setPasswordError("");

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const payload = new FormData();
        payload.append("email", formData.email);
        payload.append("name", `${formData.firstName} ${formData.lastName}`.trim());
        payload.append("role", "STUDENT");
        payload.append("dateOfBirth", formData.dateOfBirth);
        payload.append("schoolId", formData.schoolId);
        payload.append("gender", formData.gender);
        payload.append("verificationOption", formData.verificationOption);

        if (formData.grade) payload.append("grade", formData.grade);
        if (formData.phone) payload.append("contact_number", formData.phone);

        if (formData.verificationOption === "TEACHER_REQUEST" && formData.teacher_id) {
          payload.append("teacher_id", formData.teacher_id);
        }

        if (formData.verificationOption === "DOCUMENT" && uploadedFiles[0]) {
          payload.append("verificationAttachment", uploadedFiles[0]);
        }

        if (isGoogleFlow) {
          payload.append("idtoken", formData.googleIdToken);
        } else {
          payload.append("password", formData.password);
        }

        if (isGoogleFlow) {
          await registerWithGoogle(payload);
        } else {
          await registerWithEmail(payload);
        }

        if (!useUserStore.getState().error) {
          setShowSkillPickerModal(true);
        }
      } catch (err) {
        console.error("Registration failed", err);
      }
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700";
  const inputStyle = { "--tw-ring-color": "var(--primary-purple)" } as React.CSSProperties;
  const iconInputClass = "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700";
  const labelClass = "block text-sm mb-2 text-primary-dark";

  return (
    <div className="min-h-screen py-40 px-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--secondary-pale-lavender) 0%, var(--secondary-light-lavender) 50%, var(--secondary-pale-lavender) 100%)" }}>
      <PageBackground />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-6"><Image src="/icons/logoForPages.png" alt="Logo" width={80} height={80} priority /></div>
          <h1 className="text-primary-dark text-3xl font-bold tracking-tight mb-2">Student Registration</h1>
          <p className="text-muted text-sm max-w-[280px]">Create your talent portfolio account on<br /><span className="font-semibold" style={{ color: "var(--primary-blue)" }}>All-Rounder</span></p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors" style={step <= currentStep ? { background: "var(--primary-purple)", color: "#fff" } : { background: "#D1D5DB", color: "#6B7280" }}>{step}</div>
                {step < 3 && <div className="w-20 h-1 transition-colors" style={step < currentStep ? { background: "var(--primary-purple)" } : { background: "#D1D5DB" }} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-muted">
            <span>Personal</span><span>Academic</span><span>Verification</span>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-2xl p-8 border border-secondary-lavender">
          {authError && <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">{authError}</div>}

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
                    <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={iconInputClass} style={inputStyle} required />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className={iconInputClass} style={inputStyle} required />
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
                        onChange={(e) => {
                          updateField("dateOfBirth", e.target.value);
                          const nextAge = calculateAge(e.target.value);
                          if (nextAge === null || nextAge < 13 || nextAge > 19) {
                            setBirthDateError("Student age must be between 13 and 19 years.");
                          } else {
                            setBirthDateError("");
                          }
                        }}
                        className={iconInputClass}
                        style={inputStyle}
                        required
                        placeholder="YYYY-MM-DD"
                        title="Date of birth (YYYY-MM-DD)"
                      />
                    </div>
                    {birthDateError && <p className="text-sm text-red-500 mt-1">{birthDateError}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select value={formData.gender} onChange={(e) => updateField("gender", e.target.value)} className={inputClass} style={inputStyle} required>
                      <option value="" disabled>Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Academic & Password Information ── */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Academic Information<span className="block h-1 w-1/2 mx-auto mt-2 rounded-full" style={{ background: "var(--primary-blue)" }} /></h3>

                <div className="relative">
                  <label className={labelClass}>School Name *</label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <input
                      type="text"
                      value={schoolSearchTerm}
                      onChange={(e) => {
                        setSchoolSearchTerm(e.target.value);
                        setIsSchoolDropdownOpen(true);
                        if (formData.schoolId) {
                          updateField("schoolId", "");
                          updateField("teacher_id", ""); // Reset teacher if school changes
                          setTeacherSearchTerm("");
                        }
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
                        filteredSchools.map((school, i) => (
                          <div
                            key={school.school_id || `school-${i}`}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${formData.schoolId === school.school_id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                            onMouseDown={(e) => {
                              e.preventDefault(); 
                              updateField("schoolId", school.school_id);
                              setSchoolSearchTerm(school.name);
                              setIsSchoolDropdownOpen(false);

                              const schoolGender = String(school.gender || "Mixed").toLowerCase();
                              if (schoolGender === "boys") {
                                updateField("gender", "male");
                              } else if (schoolGender === "girls") {
                                updateField("gender", "female");
                              }
                              
                              // NEW: Immediately fetch teachers for this school!
                              fetchSchoolTeachers(school.school_id);
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Grade/Class *</label>
                    <select value={formData.grade} onChange={(e) => updateField("grade", e.target.value)} className={inputClass} style={inputStyle} required>
                      <option value="">Select Grade</option>
                      {[...Array(12)].map((_, i) => (<option key={i + 1} value={i + 1}>Grade {i + 1}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Student ID</label>
                    <input type="text" value={formData.studentId} onChange={(e) => updateField("studentId", e.target.value)} className={inputClass} style={inputStyle} placeholder="Optional" />
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

            {/* ── Step 3: Teacher Verification ── */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Teacher Verification<span className="block h-1 w-1/2 mx-auto mt-2 rounded-full" style={{ background: "var(--primary-blue)" }} /></h3>

                <div>
                  <label className={labelClass}>Verification Method *</label>
                  <select
                    value={formData.verificationOption}
                    onChange={(e) => {
                      updateField("verificationOption", e.target.value);
                      if (e.target.value === "DOCUMENT") {
                        updateField("teacher_id", "");
                        setTeacherSearchTerm("");
                        setTeacherError("");
                      } else {
                        setDocumentError("");
                        setUploadedFiles([]);
                      }
                    }}
                    className={inputClass}
                    style={inputStyle}
                    required
                  >
                    <option value="TEACHER_REQUEST">Teacher Request</option>
                    <option value="DOCUMENT">Upload Document</option>
                  </select>
                </div>

                {formData.verificationOption === "TEACHER_REQUEST" && (
                  <>
                    <div className="p-4 border rounded-lg mb-6" style={{ background: "var(--secondary-pale-lavender)", borderColor: "var(--secondary-light-lavender)" }}>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      required
                      disabled={isGenderSelectionDisabled}
                    >
                    </div>
                      {isMixedSchool ? (
                        <>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </>
                      ) : normalizedSchoolGender === "boys" ? (
                        <option value="male">Male</option>
                      ) : (
                        <option value="female">Female</option>
                      )}
                      <label className={labelClass}>Select Your Teacher *</label>
                    {!isMixedSchool && (
                      <p className="text-xs text-gray-500 mt-1">
                        Gender is auto-selected based on school type ({selectedSchool?.gender}).
                      </p>
                    )}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <input
                          type="text"
                          value={teacherSearchTerm}
                          onChange={(e) => {
                            setTeacherSearchTerm(e.target.value);
                            setIsTeacherDropdownOpen(true);
                            if (formData.teacher_id) updateField("teacher_id", "");
                          }}
                          onFocus={() => setIsTeacherDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setIsTeacherDropdownOpen(false), 200)}
                          className={`${iconInputClass} pr-10 cursor-text bg-white`}
                          style={inputStyle}
                          placeholder="Search by name or subject..."
                          required={formData.verificationOption === "TEACHER_REQUEST"}
                        />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>

                      {isTeacherDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((teacher, i) => (
                              <div
                                key={teacher.uid || `teacher-${i}`}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${formData.teacher_id === teacher.uid ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  updateField("teacher_id", teacher.uid);
                                  setTeacherSearchTerm(`${teacher.name} (${teacher.subject || 'Teacher'})`);
                                  setIsTeacherDropdownOpen(false);
                                }}
                              >
                                <div className="font-medium">{teacher.name}</div>
                                <div className="text-xs text-gray-500">{teacher.subject || teacher.designation}</div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 italic text-center">
                              {schoolTeachers.length === 0 ? "Loading teachers..." : "No matching teachers found."}
                            </div>
                          )}
                        </div>
                      )}
                      {teacherError && <p className="text-sm text-red-500 mt-1">{teacherError}</p>}
                    </div>
                  </>
                )}

                {formData.verificationOption === "DOCUMENT" && (
                  <>
                    <div className="p-4 border rounded-lg mb-4" style={{ background: "var(--secondary-pale-lavender)", borderColor: "var(--secondary-light-lavender)" }}>
                      <p className="text-sm text-gray-700">Upload one supporting document for verification. Allowed: PDF, JPG, PNG, WEBP (max 5 MB).</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelClass + " mb-0"}>Verification Attachment *</label>
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
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={(e) => addFiles(e.target.files)}
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2 py-8 px-4 select-none">
                          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1" style={{ background: "var(--secondary-pale-lavender)" }}>
                            <Upload className="w-6 h-6" style={{ color: "var(--primary-blue)" }} />
                          </div>
                          <p className="text-sm font-medium text-primary-dark">{dragOver ? "Drop file here" : "Drag & drop or click to browse"}</p>
                          <p className="text-xs text-muted">PDF, JPG, PNG, WEBP · max 5 MB</p>
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
                      {documentError && <p className="text-sm text-red-500 mt-2">{documentError}</p>}
                    </div>
                  </>
                )}

                {formData.verificationOption === "TEACHER_REQUEST" && formData.teacher_id && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 mt-4">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Teacher Selected</p>
                      <p className="text-xs text-green-700 mt-1">A verification request will be sent directly once you submit.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)} disabled={isAuthLoading} className="flex-1 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">Back</button>
              )}
              <button type="submit" disabled={isAuthLoading || !isCurrentStepValid} className="flex-1 py-3 text-white rounded-lg font-medium hover:opacity-90 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: "var(--primary-purple)" }}>
                {isAuthLoading && currentStep === 3 ? "Creating Account..." : (currentStep === 3 ? "Submit for Verification" : "Next")}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">Already have an account? <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--primary-blue)" }}>Sign in</Link></p>
          </div>
        </div>
      </div>

      {/* Skill Picker Modal - shown after successful signup */}
      <SkillPickerModal
        isOpen={showSkillPickerModal}
        onClose={(skipped) => {
          setShowSkillPickerModal(false);
          alert("Student account created! Awaiting teacher verification.");
          router.push("/login");
        }}
        onComplete={() => {
          setShowSkillPickerModal(false);
          alert("Student account created! Awaiting teacher verification.");
          router.push("/login");
        }}
      />
    </div>
  );
}