import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | All-Rounder",
  description: "Discover competitions, workshops, and events to build your extracurricular profile on All-Rounder.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Events | All-Rounder",
    description: "Discover competitions, workshops, and events to build your extracurricular profile on All-Rounder.",
    url: "https://all-rounder.lk/events",
    type: "website",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
