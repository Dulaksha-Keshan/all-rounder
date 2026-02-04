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
          User } from "lucide-react";
import Image from "next/image";

export default function OrganizationSignup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">
                  Organization Information
                </h3>

                <div>
                  <label className="block text-sm mb-2">
                    Organization Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      required
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                      value={formData.organizationName}
                      onChange={(e) =>
                        updateField("organizationName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Organization Type *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.organizationType}
                    onChange={(e) =>
                      updateField("organizationType", e.target.value)
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="nonprofit">Non-Profit</option>
                    <option value="corporate">Corporate</option>
                    <option value="foundation">Foundation</option>
                    <option value="government">Government</option>
                    <option value="ngo">NGO</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Mission Statement *
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.missionStatement}
                    onChange={(e) =>
                      updateField("missionStatement", e.target.value)
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        value={formData.password}
                        onChange={(e) =>
                          updateField("password", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                    />
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


            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-[#34365C] mb-4">
                  Authorized Representative
                </h3>

                <div>
                  <label className="block text-sm mb-2">
                    Upload Verification Documents *
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      hidden
                      id="file-upload"
                      required
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" />
                      {uploadedFile ? (
                        <div className="flex justify-center items-center gap-2 text-[#8387CC]">
                          <FileText className="w-5 h-5" />
                          {uploadedFile.name}
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          Upload registration documents
                        </p>
                      )}
                    </label>
                  </div>
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
