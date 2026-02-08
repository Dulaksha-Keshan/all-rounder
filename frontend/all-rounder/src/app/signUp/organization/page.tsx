"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, 
          Mail, 
          Lock, 
          MapPin, 
          Phone, 
          Globe, 
          Upload, 
          FileText,
          User,
          Eye,
          EyeOff } from "lucide-react";
import Image from "next/image";

export default function OrganizationSignup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    taxId: "",
    registrationNumber: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    repName: "",
    repTitle: "",
    repEmail: "",
    repPhone: "",
    password: "",
    confirmPassword: "",
    missionStatement: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFile(e.target.files[0]);
    }
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
      setCurrentStep((prev) => prev + 1);
    } else {
      alert("Organization account created! Your registration is under review.");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FF] to-[#DCD0FF] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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

        <div className="text-center mb-8">
          <h1 className="text-[#34365C] mb-2">Organization Registration</h1>
          <p className="text-gray-600">
            Join as a sponsor or partner organization
          </p>
        </div>

        {/* Step Indicator */}
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
                      step < currentStep
                        ? "bg-[#8387CC]"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-gray-600">
            <span>Organization</span>
            <span>Contact</span>
            <span>Representative</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>

            {/* Step 1: Organization Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Organization Information</h3>
                
                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Organization Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => updateField("organizationName", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Organization Type *</label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => updateField("organizationType", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                    required
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="nonprofit">Non-Profit Organization</option>
                    <option value="corporate">Corporate/Business</option>
                    <option value="foundation">Foundation</option>
                    <option value="government">Government Agency</option>
                    <option value="ngo">NGO</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Tax ID/EIN *</label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => updateField("taxId", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      placeholder="XX-XXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Registration Number</label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => updateField("registrationNumber", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Mission Statement *</label>
                  <textarea
                    value={formData.missionStatement}
                    onChange={(e) => updateField("missionStatement", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                    rows={3}
                    placeholder="Briefly describe your organization's mission and goals"
                    required
                  />
                </div>

                {/* Passwords with eye toggle */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Password */}
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
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
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

                  {/* Confirm Password */}
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
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Website *</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      placeholder="https://www.organization.org"
                      required
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => updateField("zipCode", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    />
                  </div>
                </div>
              </div>
            )}


            {/* Step 3: Representative Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">Authorized Representative</h3>
                
                <div className="p-4 bg-[#F8F8FF] border border-[#DCD0FF] rounded-lg mb-4">
                  <p className="text-sm text-gray-700">
                    Please provide details of the authorized representative who will manage this account.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Representative Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.repName}
                        onChange={(e) => updateField("repName", e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Title/Position *</label>
                    <input
                      type="text"
                      value={formData.repTitle}
                      onChange={(e) => updateField("repTitle", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      placeholder="e.g., Director, CEO"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Representative Email *</label>
                    <input
                      type="email"
                      value={formData.repEmail}
                      onChange={(e) => updateField("repEmail", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#34365C]">Representative Phone *</label>
                    <input
                      type="tel"
                      value={formData.repPhone}
                      onChange={(e) => updateField("repPhone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#34365C]">Upload Verification Documents *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#8387CC] transition">
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
                        <div className="flex items-center justify-center gap-2 text-[#8387CC]">
                          <FileText className="w-5 h-5" />
                          <span>{uploadedFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-600">Upload registration documents</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Tax exemption letter, articles of incorporation, or business license
                          </p>
                          <p className="text-sm text-gray-500">PDF, JPG, or PNG (max 10MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🔒 Your organization will be verified within 3-5 business days. 
                    You'll receive confirmation via email once approved.
                  </p>
                </div>
              </div>
            )}


            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((p) => p - 1)}
                  className="flex-1 bg-gray-200 py-3 rounded-lg"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-[#8387CC] text-white py-3 rounded-lg"
              >
                {currentStep === 3
                  ? "Submit for Verification"
                  : "Next"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm mt-6">
            Already registered?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
