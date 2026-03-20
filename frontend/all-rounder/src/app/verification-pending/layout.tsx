import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification Pending | All-Rounder",
  description: "Your account verification request is currently under review.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerificationPendingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
