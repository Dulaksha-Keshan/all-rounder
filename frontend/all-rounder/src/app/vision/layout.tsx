import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision | All-Rounder",
  description: "Learn the vision behind All-Rounder and how we empower students, teachers, schools, and organizations.",
  alternates: {
    canonical: "/vision",
  },
  openGraph: {
    title: "Vision | All-Rounder",
    description: "Learn the vision behind All-Rounder and how we empower students, teachers, schools, and organizations.",
    url: "https://all-rounder.lk/vision",
    type: "website",
  },
};

export default function VisionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
