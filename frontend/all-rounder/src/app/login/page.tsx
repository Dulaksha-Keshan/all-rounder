"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";



export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<
    "student" | "teacher" | "school" | "organization"
  >("student");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
  });

  const [show2FA, setShow2FA] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!show2FA) {
      setShow2FA(true);
    } else {
      router.push("/dashboard");
    }
  };

  const userTypes = [
    { value: "student", label: "Student", color: "bg-purple-400" },
    { value: "teacher", label: "Teacher", color: "bg-blue-500" },
    { value: "school", label: "School", color: "bg-gray-700" },
    { value: "organization", label: "Organization", color: "bg-purple-400" },
  ] as const;


  
  return (
    <>
      {/* Sticky Header */}
      {/* <div className="sticky top-0 z-50 bg-[var(--white)]">
        <Navbar/>
      </div> */}
  
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 flex justify-center">
              <Image
                src="/icons/logoForPages.png"
                alt="Login Icon"
                width={80}
                height={80}
                
              />
            </div>
            <h1 className="text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">
              Sign in to continue to All-Rounder
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              
              {/* User Type Selection
              <div>
                <label className="block text-sm mb-2 text-gray-800">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {userTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setUserType(type.value)}
                      className={`px-4 py-2 rounded-lg transition ${
                        userType === type.value
                          ? `${type.color} text-white`
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-2 text-gray-800"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm mb-2 text-gray-800"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Image
                      src={showPassword ? "/icons/openEye.jpg" : "/icons/closeEye.jpg"}
                      alt={showPassword ? "Hide password" : "Show password"}
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              {show2FA && (
                <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                  <label
                    htmlFor="twoFactorCode"
                    className="block text-sm mb-2 text-gray-800"
                  >
                    Two-Factor Authentication Code
                  </label>
                  <input
                    type="text"
                    id="twoFactorCode"
                    value={formData.twoFactorCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        twoFactorCode: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Enter the code from your authenticator app
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {show2FA ? "Verify & Sign In" : "Continue"}
              </button>
            </form>

            {/* Forgot Password */}
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-500 hover:underline">
                Forgot your password?
              </button>
            </div>

            {/* Sign Up Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">
                Don't have an account? {" "} 
                <button className="text-sm text-blue-500 hover:underline">
                Sign Up
              </button>
              </p>

            
              {/* <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/signup/student"
                  className="text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Student Signup
                </Link>
                <Link
                  href="/signup/teacher"
                  className="text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Teacher Signup
                </Link>
                <Link
                  href="/signup/school"
                  className="text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  School Signup
                </Link>
                <Link
                  href="/signup/organization"
                  className="text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Organization Signup
                </Link>
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}