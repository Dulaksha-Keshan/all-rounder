import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | All-Rounder",
  description: "Get answers about accounts, verification, features, and support in the All-Rounder Help Center.",
  alternates: {
    canonical: "/help",
  },
  openGraph: {
    title: "Help Center | All-Rounder",
    description: "Get answers about accounts, verification, features, and support in the All-Rounder Help Center.",
    url: "https://all-rounder.lk/help",
    type: "website",
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
