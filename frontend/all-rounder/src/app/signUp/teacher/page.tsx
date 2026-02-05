"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, School, Upload, FileText } from "lucide-react";
import Image from "next/image";


export default function TeacherSignup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Professional Information
    schoolName: "",
    department: "",
    employeeId: "",
    yearsOfExperience: "",
    
    // Account Security
    password: "",
    confirmPassword: "",
    
    // Verification
    verificationType: "staff-id", // or "appointment-letter"
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Teacher account created! Your verification documents are under review.");
      router.push("/login");
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FF] to-[#DCD0FF] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Sticky Header - same as the login */}       
          <div className="max-w-md mx-auto">
            {/* Icon */}
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
          <h1 className="text-[#34365C] mb-2">Teacher Registration</h1>
          <p className="text-gray-600">Join as a verified educator</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-[#4169E1] text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 ${
                      step < currentStep ? "bg-[#4169E1]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-gray-600">
            <span>Personal</span>
            <span>Professional</span>
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                      placeholder="teacher@school.edu"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Confirm Password *</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Professional Information</h3>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">School/Institution Name *</label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => updateField("schoolName", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                      placeholder="Enter your school name"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Department/Subject *</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => updateField("department", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                      placeholder="e.g., Mathematics, Science"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Employee ID *</label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => updateField("employeeId", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Years of Experience *</label>
                  <select
                    value={formData.yearsOfExperience}
                    onChange={(e) => updateField("yearsOfExperience", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                    required
                  >
                    <option value="">Select</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-15">11-15 years</option>
                    <option value="16+">16+ years</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Employment Verification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Employment Verification</h3>
                
                <div className="p-4 bg-[#F8F8FF] border border-[#DCD0FF] rounded-lg mb-4">
                  <p className="text-sm text-gray-700">
                    To gain "Verified Teacher" status, please upload proof of employment. This can be:
                  </p>
                  <ul className="text-sm text-gray-700 ml-4 mt-2 list-disc">
                    <li>Staff ID Card (photo or scan)</li>
                    <li>Official Appointment Letter</li>
                    <li>Employment Contract</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Document Type *</label>
                  <select
                    value={formData.verificationType}
                    onChange={(e) => updateField("verificationType", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                    required
                  >
                    <option value="staff-id">Staff ID Card</option>
                    <option value="appointment-letter">Appointment Letter</option>
                    <option value="employment-contract">Employment Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Upload Document *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#4169E1] transition">
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
                        <div className="flex items-center justify-center gap-2 text-[#4169E1]">
                          <FileText className="w-5 h-5" />
                          <span>{uploadedFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-500 mt-1">PDF, JPG, or PNG (max 5MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🔒 Your documents will be reviewed by our verification team within 24-48 hours. 
                    You'll receive an email once your account is verified.
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
                className="flex-1 py-3 bg-[#4169E1] text-white rounded-lg hover:bg-[#3557c1] transition"
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