"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  MapPin,
  Phone,
  Globe,
  Upload,
  FileType2,
  FileImage,
  User,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  PlusCircle,
  ChevronDown,
  Calendar,
  Briefcase
} from "lucide-react";
import Image from "next/image";

// Stores & Auth
import { useUserStore } from "@/context/useUserStore";
import { useOrganizationStore } from "@/context/useOrganizationStore";
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

export default function OrganizationSignup() {
  const router = useRouter();

  // Stores
  const { registerWithEmail, registerWithGoogle, registerNewOrganization, isLoading, error } = useUserStore();
  const showToast = useToastStore((state) => state.showToast);
  const { organizations, fetchOrganizations } = useOrganizationStore();

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useEffect(() => {
    if (!error) return;
    showToast(error, "error");
  }, [error, showToast]);

  // Flow State
  const [registrationMode, setRegistrationMode] = useState<"new" | "existing">("new");
  const [currentStep, setCurrentStep] = useState(1);
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);

  // Form State
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [orgError, setOrgError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dropdown State
  const [orgSearchTerm, setOrgSearchTerm] = useState("");
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    // Org Fields (Only used if "new")
    organizationName: "",
    contactPerson: "",
    website: "",
    
    // Existing Org Link
    organizationId: "", 

    // Admin Fields
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    staffId: "",
    password: "",
    confirmPassword: "",
    verificationType: "DOCUMENT",
    googleIdToken: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredOrgs = organizations.filter(org => 
    org.organization_name.toLowerCase().includes(orgSearchTerm.toLowerCase())
  );

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
  const isAdminAgeValid = age !== null && age > 23;

  const isStep1Valid = registrationMode === "new"
    ? Boolean(formData.organizationName.trim() && formData.contactPerson.trim())
    : Boolean(formData.organizationId);

  const isStep2Valid = Boolean(
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.dateOfBirth &&
    isAdminAgeValid &&
    (isGoogleFlow || (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword))
  );

  const isStep3Valid = uploadedFiles.length > 0;
  const isCurrentStepValid = currentStep === 1 ? isStep1Valid : currentStep === 2 ? isStep2Valid : isStep3Valid;

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
    if (file.type === "application/pdf") return <FileType2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary-blue)" }} />;
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
    } catch (error) {
      console.error("Google Initiation failed", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCurrentStepValid) {
      return;
    }

    // Validations based on Step & Mode
    if (currentStep === 1) {
      if (registrationMode === "existing" && !formData.organizationId) {
        setOrgError("Please select an existing organization.");
        return;
      }
      setOrgError("");
    }

    if (currentStep === 2 && !isAdminAgeValid) {
      setBirthDateError("Organization admin must be older than 23 years.");
      return;
    }

    if (currentStep === 2 && !isGoogleFlow) {
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
      setPasswordError("");
    }
    if (currentStep === 2) {
      setBirthDateError("");
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (uploadedFiles.length === 0) return;

      try {
        const payload = new FormData();

        // 1. Common Admin Details
        const adminData: any = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          date_of_birth: formData.dateOfBirth,
          contact_number: formData.phone || null,
          staff_id: formData.staffId || null,
        };

        if (isGoogleFlow) {
          adminData.idtoken = formData.googleIdToken;
        } else {
          adminData.password = formData.password;
        }
        adminData.authProvider = isGoogleFlow ? "GOOGLE" : "EMAIL";

        // 2. Route based on Registration Mode
        if (registrationMode === "new") {
          // Creating BOTH Org and Admin (Hits the nested controller)
          payload.append("organization_name", formData.organizationName);
          payload.append("contact_person", formData.contactPerson);
          if (formData.website) payload.append("website", formData.website);
          
          // Stringify the nested admin object for Multer
          payload.append("admin", JSON.stringify(adminData));

          uploadedFiles.forEach((file) => {
            payload.append("attachments", file); 
          });

          await registerNewOrganization(payload);

        } else {
          // Creating ONLY Admin linked to Existing Org (Hits standard /register)
          payload.append("name", adminData.name);
          payload.append("email", adminData.email);
          payload.append("date_of_birth", adminData.date_of_birth);
          if (adminData.contact_number) payload.append("contact_number", adminData.contact_number);
          if (adminData.staff_id) payload.append("staff_id", adminData.staff_id);
          
          payload.append("role", "ORG_ADMIN");
          payload.append("authProvider", isGoogleFlow ? "GOOGLE" : "EMAIL");
          payload.append("organizationId", formData.organizationId);
          payload.append("verificationOption", formData.verificationType);
          
          if (isGoogleFlow) {
            payload.append("idtoken", adminData.idtoken);
          } else {
            payload.append("password", adminData.password);
          }

          uploadedFiles.forEach((file) => {
            payload.append("attachments", file); 
          });

          if (isGoogleFlow) {
            await registerWithGoogle(payload);
          } else {
            await registerWithEmail(payload as any);
          }
        }

        if (!useUserStore.getState().error) {
          showToast("Account created! Your registration is under review.", "success");
          router.push("/login");
        }
      } catch (err) {
        console.error("Registration failed", err);
        showToast("Registration failed. Please try again.", "error");
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
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-6"><Image src="/icons/logoForPages.png" alt="Logo" width={80} height={80} priority /></div>
          <h1 className="text-primary-dark text-3xl font-bold tracking-tight mb-2">Organization Portal</h1>
          <p className="text-muted text-sm max-w-[320px]">Join as a verified organization or register as an administrator for an existing one.</p>
        </div>

        {/* Mode Toggle (Only visible on Step 1) */}
        {currentStep === 1 && (
          <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm border border-gray-200">
            <button
              onClick={() => setRegistrationMode("new")}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${registrationMode === "new" ? "bg-primary-purple text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Register New Organization
            </button>
            <button
              onClick={() => setRegistrationMode("existing")}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${registrationMode === "existing" ? "bg-primary-purple text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Join Existing Organization
            </button>
          </div>
        )}

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
            <span>Organization</span><span>Admin Details</span><span>Verification</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="surface-readable-strong rounded-xl p-8">

          <form onSubmit={handleSubmit}>

            {/* ── Step 1: Organization Information ── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                
                {registrationMode === "new" ? (
                  <>
                    <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Create Organization<span className="block h-1 w-1/2 bg-primary-blue mx-auto mt-1 rounded-full" /></h3>

                    <div>
                      <label className={labelClass}>Organization Name *</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" value={formData.organizationName} onChange={(e) => updateField("organizationName", e.target.value)} className={iconInputClass} style={inputStyle} required />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Contact Person Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" value={formData.contactPerson} onChange={(e) => updateField("contactPerson", e.target.value)} className={iconInputClass} style={inputStyle} placeholder="Primary point of contact" required />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Website URL</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="url" value={formData.website} onChange={(e) => updateField("website", e.target.value)} className={iconInputClass} style={inputStyle} placeholder="https://..." />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Select Organization<span className="block h-1 w-1/2 bg-primary-blue mx-auto mt-1 rounded-full" /></h3>
                    
                    <div className="relative">
                      <label className={labelClass}>Search Registered Organizations *</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <input
                          type="text"
                          value={orgSearchTerm}
                          onChange={(e) => {
                            setOrgSearchTerm(e.target.value);
                            setIsOrgDropdownOpen(true);
                            if (formData.organizationId) updateField("organizationId", "");
                          }}
                          onFocus={() => setIsOrgDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setIsOrgDropdownOpen(false), 200)}
                          className={`${iconInputClass} pr-10 cursor-text bg-white`}
                          style={inputStyle}
                          placeholder="Type to search..."
                          required
                        />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>

                      {isOrgDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {filteredOrgs.length > 0 ? (
                            filteredOrgs.map((org) => (
                              <div
                                key={org.organization_id}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${formData.organizationId === org.organization_id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                                onMouseDown={(e) => {
                                  e.preventDefault(); 
                                  updateField("organizationId", org.organization_id);
                                  setOrgSearchTerm(org.organization_name);
                                  setIsOrgDropdownOpen(false);
                                }}
                              >
                                {org.organization_name}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 italic text-center">No matching organizations found.</div>
                          )}
                        </div>
                      )}
                      {orgError && <p className="text-sm text-red-500 mt-1">{orgError}</p>}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Step 2: Admin Personal Details ── */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Administrator Details<span className="block h-1 w-1/2 bg-primary-blue mx-auto mt-1 rounded-full" /></h3>

                {!isGoogleFlow && (
                  <>
                    <button type="button" onClick={handleGoogleInitiate} className="w-full mb-6 py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition bg-white text-gray-700 font-medium shadow-sm">
                      <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                      Fast-fill with Google
                    </button>

                    <div className="flex items-center justify-between mb-6">
                      <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
                      <p className="text-xs text-center text-gray-500 uppercase">or enter details manually</p>
                      <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
                    </div>
                  </>
                )}

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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className={iconInputClass} style={inputStyle} />
                    </div>
                  </div>
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
                          if (nextAge === null || nextAge <= 23) {
                            setBirthDateError("Organization admin must be older than 23 years.");
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
                </div>

                <div>
                  <label className={labelClass}>Staff/Admin ID</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={formData.staffId} onChange={(e) => updateField("staffId", e.target.value)} className={iconInputClass} style={inputStyle} placeholder="Optional" />
                  </div>
                </div>

                {!isGoogleFlow && (
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
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

            {/* ── Step 3: Verification ── */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-primary-dark text-xl font-bold text-center mb-6">Verification Documents<span className="block h-1 w-1/2 bg-primary-blue mx-auto mt-1 rounded-full" /></h3>

                <div className="p-4 border rounded-lg mb-4" style={{ background: "var(--secondary-pale-lavender)", borderColor: "var(--secondary-light-lavender)" }}>
                  <p className="text-sm text-gray-700">
                    {registrationMode === "new" 
                      ? "To register a new organization, please upload proof of business registration or incorporation, AND your personal admin authorization."
                      : "To join this organization as an admin, please upload your staff ID or authorization letter."
                    }
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Document Type *</label>
                  <select value={formData.verificationType} onChange={(e) => updateField("verificationType", e.target.value)} className={inputClass} style={inputStyle} required>
                    {registrationMode === "new" && <option value="org-registration">Org Registration Certificate</option>}
                    <option value="admin-id">Admin Staff ID Card</option>
                    <option value="authorization-letter">Official Authorization Letter</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass + " mb-0"}>Upload Documents *</label>
                    {uploadedFiles.length > 0 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--secondary-pale-lavender)", color: "var(--primary-purple)" }}>
                        {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} added
                      </span>
                    )}
                  </div>

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
                    <input ref={fileInputRef} type="file" onChange={(e) => addFiles(e.target.files)} accept=".pdf,.jpg,.jpeg,.png" className="hidden" multiple />
                    <div className="flex flex-col items-center gap-2 py-8 px-4 select-none">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1" style={{ background: "var(--secondary-pale-lavender)" }}>
                        <Upload className="w-6 h-6" style={{ color: "var(--primary-purple)" }} />
                      </div>
                      <p className="text-sm font-medium text-primary-dark">{dragOver ? "Drop files here" : "Drag & drop or click to browse"}</p>
                      <p className="text-xs text-muted">PDF, JPG or PNG · max 10 MB each</p>
                      <div className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5" style={{ background: "var(--secondary-pale-lavender)", color: "var(--primary-purple)" }}>
                        <PlusCircle className="w-3.5 h-3.5" /> Add files
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

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">🔒 Registrations are verified within 3-5 business days. You'll receive confirmation via email once approved.</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep((p) => p - 1)} disabled={isLoading} className="flex-1 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">Back</button>
              )}
              <button type="submit" disabled={isLoading || !isCurrentStepValid} className="flex-1 py-3 text-white rounded-lg font-medium hover:opacity-90 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: "var(--primary-purple)" }}>
                {isLoading && currentStep === 3 ? "Creating Account..." : (currentStep === 3 ? "Submit for Verification" : "Next")}
              </button>
            </div>
          </form>

          <p className="text-center text-sm mt-6 text-muted">
            Already registered? <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--primary-blue)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}