"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { useToastStore } from "@/context/useToastStore";
//import { useAuthStore } from "@/stores/authStore"; EXAMPLE

const PASSWORD_REQUIREMENTS = [
  "At least 8 characters",
  "One uppercase letter",
  "One lowercase letter",
  "One number",
];


function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="mb-8">
        <Image src="/icons/logoForPages.png" alt="Logo" width={80} height={80} priority />
      </div>
      <h1 className="text-primary-dark text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted">{subtitle}</p>
    </div>
  );
}

function PasswordInput({
  id,
  label,
  value,
  placeholder,
  show,
  onToggle,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm mb-2 text-primary-dark">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": "var(--primary-purple)" } as React.CSSProperties}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  //const resetToken = useAuthStore((s) => s.resetToken);
  //const clearResetToken = useAuthStore((s) => s.clearResetToken);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showToast = useToastStore((state) => state.showToast);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!error) return;
    showToast(error, "error");
  }, [error, showToast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen py-40 px-4 relative">
        <div className="max-w-md mx-auto relative z-10">
          <PageHeader title="Success!" subtitle="Your password has been reset" />
          <div className="surface-readable-strong rounded-xl p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-primary-dark mb-2">Password Reset Complete!</h3>
                <p className="text-muted">
                  Your password has been successfully reset. You can now login with your new password.
                </p>
              </div>
              <Link
                href="/login"
                className="block w-full py-3 text-white rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg text-center font-medium"
                style={{ background: "var(--primary-blue)" }}
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-40 px-4 relative">
      <div className="max-w-md mx-auto relative z-10">
        <PageHeader title="Reset Password" subtitle="Choose a new secure password" />

        <div className="surface-readable-strong rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              id="newPassword"
              label="New Password"
              value={newPassword}
              placeholder="Enter new password"
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              onChange={setNewPassword}
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm New Password"
              value={confirmPassword}
              placeholder="Confirm new password"
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((v) => !v)}
              onChange={setConfirmPassword}
            />

            {/* Password Requirements */}
            <div className="p-4 rounded-lg border border-secondary-lavender" style={{ background: "var(--secondary-pale-lavender)" }}>
              <p className="text-xs text-gray-700 mb-2">Password must contain:</p>
              <ul className="text-xs text-muted space-y-1">
                {PASSWORD_REQUIREMENTS.map((req) => (
                  <li key={req} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--primary-purple)" }} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg font-medium"
              style={{ background: "var(--primary-blue)" }}
            >
              Reset Password
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm hover:underline"
              style={{ color: "var(--primary-blue)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            Need help?{" "}
            <Link href="/faq" className="hover:underline" style={{ color: "var(--primary-blue)" }}>
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


// need to add email verification later
// after the stores are declared and connected? or before? how?
// if so this code below is the that version

// ==============================================================================
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
// import { useAuthStore } from "@/stores/authStore"; // ← adjust path to your store

// const PASSWORD_REQUIREMENTS = [
//   "At least 8 characters",
//   "One uppercase letter",
//   "One lowercase letter",
//   "One number",
// ];

// const STAR_POSITIONS = [
//   "top-10 sm:top-20 left-5 sm:left-10 text-3xl sm:text-4xl lg:text-5xl opacity-40",
//   "top-20 sm:top-32 right-10 sm:right-20 text-2xl sm:text-3xl lg:text-4xl opacity-30",
//   "bottom-20 sm:bottom-32 left-16 sm:left-32 text-4xl sm:text-5xl lg:text-6xl opacity-25",
//   "top-1/3 right-16 sm:right-32 text-3xl sm:text-4xl lg:text-5xl opacity-35",
//   "bottom-10 sm:bottom-20 right-6 sm:right-12 text-2xl sm:text-3xl lg:text-4xl opacity-30",
//   "top-1/2 left-10 sm:left-20 text-xl sm:text-2xl lg:text-3xl opacity-25",
//   "top-1/4 left-1/4 text-2xl sm:text-3xl opacity-20",
//   "bottom-1/3 right-1/4 text-xl sm:text-2xl opacity-20",
// ];

// const PAGE_STYLE = {
//   background:
//     "linear-gradient(135deg, var(--secondary-pale-lavender) 0%, var(--secondary-light-lavender) 50%, var(--secondary-pale-lavender) 100%)",
// };

// // ---------------------------------------------------------------------------
// // Sub-components
// // ---------------------------------------------------------------------------

// function PageBackground() {
//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {/* Gradient Orbs */}
//       <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl" style={{ background: "var(--primary-purple)" }} />
//       <div className="absolute -top-20 right-0 w-[380px] h-[380px] rounded-full opacity-20 blur-3xl" style={{ background: "var(--primary-blue)" }} />
//       <div className="absolute bottom-0 -right-24 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl" style={{ background: "var(--secondary-light-lavender)" }} />
//       <div className="absolute -bottom-20 left-10 w-[300px] h-[300px] rounded-full opacity-20 blur-2xl" style={{ background: "var(--primary-dark-purple)" }} />
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl" style={{ background: "var(--secondary-purple-light)" }} />
//       {STAR_POSITIONS.map((classes, i) => (
//         <div key={i} className={`absolute ${classes}`} style={{ color: "var(--primary-dark-purple)" }}>
//           ★
//         </div>
//       ))}
//     </div>
//   );
// }

// function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
//   return (
//     <div className="flex flex-col items-center text-center mb-8">
//       <div className="mb-6">
//         <Image src="/icons/logoForPages.png" alt="Logo" width={80} height={80} priority />
//       </div>
//       <h1 className="text-primary-dark text-3xl font-bold mb-2">{title}</h1>
//       <p className="text-muted">{subtitle}</p>
//     </div>
//   );
// }

// function PasswordInput({
//   id,
//   label,
//   value,
//   placeholder,
//   show,
//   onToggle,
//   onChange,
//   disabled,
// }: {
//   id: string;
//   label: string;
//   value: string;
//   placeholder: string;
//   show: boolean;
//   onToggle: () => void;
//   onChange: (value: string) => void;
//   disabled?: boolean;
// }) {
//   return (
//     <div>
//       <label htmlFor={id} className="block text-sm mb-2 text-primary-dark">
//         {label}
//       </label>
//       <div className="relative">
//         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//         <input
//           type={show ? "text" : "password"}
//           id={id}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
//           style={{ "--tw-ring-color": "var(--primary-purple)" } as React.CSSProperties}
//           placeholder={placeholder}
//           disabled={disabled}
//           required
//         />
//         <button
//           type="button"
//           onClick={onToggle}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//           aria-label={show ? "Hide password" : "Show password"}
//         >
//           {show ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ---------------------------------------------------------------------------
// // Main page
// // ---------------------------------------------------------------------------

// export default function ForgotPasswordPage() {
//   const router = useRouter();

//   // Read the reset token saved by your OTP verification step.
//   // Also grab clearResetToken so we clean up after a successful reset.
//   //
//   // Your Zustand store should expose something like:
//   //   { resetToken: string | null, clearResetToken: () => void }
//   //
//   // Adjust the selector names below to match your actual store shape.
//   const resetToken = useAuthStore((s) => s.resetToken);
//   const clearResetToken = useAuthStore((s) => s.clearResetToken);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // ---------------------------------------------------------------------------
//   // Guard: no token means the user skipped OTP or the store was cleared
//   // ---------------------------------------------------------------------------

//   if (!resetToken && !success) {
//     return (
//       <div className="min-h-screen py-40 px-4 relative overflow-hidden" style={PAGE_STYLE}>
//         <PageBackground />
//         <div className="max-w-md mx-auto relative z-10">
//           <PageHeader title="Link Expired" subtitle="Your reset session is no longer valid" />
//           <div className="bg-card rounded-xl shadow-2xl p-8 border border-secondary-lavender text-center space-y-6">
//             <div className="flex justify-center">
//               <div className="bg-red-100 p-4 rounded-full">
//                 <AlertCircle className="w-16 h-16 text-red-500" />
//               </div>
//             </div>
//             <p className="text-muted">
//               This session has expired or is invalid. Please restart the password reset process.
//             </p>
//             <Link
//               href="/forgot-password"
//               className="block w-full py-3 text-white rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg text-center font-medium"
//               style={{ background: "var(--primary-blue)" }}
//             >
//               Restart Reset
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ---------------------------------------------------------------------------
//   // Submit handler — calls your Node.js backend
//   // ---------------------------------------------------------------------------

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     // Client-side validation
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }
//     if (newPassword.length < 8) {
//       setError("Password must be at least 8 characters");
//       return;
//     }

//     setLoading(true);
//     try {
//       // POST to your Node.js endpoint.
//       // Adjust the URL / route to match your API.
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: resetToken, newPassword }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         // Surface whatever error message the backend returns,
//         // e.g. "Token expired", "Token invalid", etc.
//         setError(data?.message ?? "Something went wrong. Please try again.");
//         return;
//       }

//       // Clear the token from the store so it can't be reused
//       clearResetToken();
//       setSuccess(true);
//     } catch {
//       setError("Network error. Please check your connection and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------------------------------------------------------------
//   // Success screen
//   // ---------------------------------------------------------------------------

//   if (success) {
//     return (
//       <div className="min-h-screen py-40 px-4 relative overflow-hidden" style={PAGE_STYLE}>
//         <PageBackground />
//         <div className="max-w-md mx-auto relative z-10">
//           <PageHeader title="Success!" subtitle="Your password has been reset" />
//           <div className="bg-card rounded-xl shadow-2xl p-8 border border-secondary-lavender">
//             <div className="text-center space-y-6">
//               <div className="flex justify-center">
//                 <div className="bg-green-100 p-4 rounded-full">
//                   <CheckCircle className="w-16 h-16 text-green-600" />
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-primary-dark mb-2">Password Reset Complete!</h3>
//                 <p className="text-muted">
//                   Your password has been successfully reset. You can now login with your new password.
//                 </p>
//               </div>
//               <Link
//                 href="/login"
//                 className="block w-full py-3 text-white rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg text-center font-medium"
//                 style={{ background: "var(--primary-blue)" }}
//               >
//                 Go to Login
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ---------------------------------------------------------------------------
//   // Reset form
//   // ---------------------------------------------------------------------------

//   return (
//     <div className="min-h-screen py-40 px-4 relative overflow-hidden" style={PAGE_STYLE}>
//       <PageBackground />
//       <div className="max-w-md mx-auto relative z-10">
//         <PageHeader title="Reset Password" subtitle="Choose a new secure password" />

//         <div className="bg-card rounded-xl shadow-2xl p-8 border border-secondary-lavender">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//                 <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//                 <p className="text-sm text-red-800">{error}</p>
//               </div>
//             )}

//             <PasswordInput
//               id="newPassword"
//               label="New Password"
//               value={newPassword}
//               placeholder="Enter new password"
//               show={showPassword}
//               onToggle={() => setShowPassword((v) => !v)}
//               onChange={setNewPassword}
//               disabled={loading}
//             />

//             <PasswordInput
//               id="confirmPassword"
//               label="Confirm New Password"
//               value={confirmPassword}
//               placeholder="Confirm new password"
//               show={showConfirmPassword}
//               onToggle={() => setShowConfirmPassword((v) => !v)}
//               onChange={setConfirmPassword}
//               disabled={loading}
//             />

//             {/* Password Requirements */}
//             <div
//               className="p-4 rounded-lg border border-secondary-lavender"
//               style={{ background: "var(--secondary-pale-lavender)" }}
//             >
//               <p className="text-xs text-gray-700 mb-2">Password must contain:</p>
//               <ul className="text-xs text-muted space-y-1">
//                 {PASSWORD_REQUIREMENTS.map((req) => (
//                   <li key={req} className="flex items-center gap-2">
//                     <div
//                       className="w-1.5 h-1.5 rounded-full flex-shrink-0"
//                       style={{ background: "var(--primary-purple)" }}
//                     />
//                     {req}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 text-white rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed"
//               style={{ background: "var(--primary-blue)" }}
//             >
//               {loading ? "Resetting…" : "Reset Password"}
//             </button>

//             <Link
//               href="/login"
//               className="flex items-center justify-center gap-2 text-sm hover:underline"
//               style={{ color: "var(--primary-blue)" }}
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Login
//             </Link>
//           </form>
//         </div>

//         <div className="mt-6 text-center">
//           <p className="text-sm text-muted">
//             Need help?{" "}
//             <Link href="/faq" className="hover:underline" style={{ color: "var(--primary-blue)" }}>
//               Contact Support
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }