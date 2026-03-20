import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | All-Rounder",
  description: "Create an All-Rounder account as a student, teacher, school, or organization.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
