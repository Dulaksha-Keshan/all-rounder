import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resource Sharing | All-Rounder",
  description: "Discover and share educational resources with schools and communities on All-Rounder.",
  alternates: {
    canonical: "/resourceSharing",
  },
  openGraph: {
    title: "Resource Sharing | All-Rounder",
    description: "Discover and share educational resources with schools and communities on All-Rounder.",
    url: "https://all-rounder.lk/resourceSharing",
    type: "website",
  },
};

export default function ResourceSharingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
