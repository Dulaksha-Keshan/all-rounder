import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | All-Rounder",
  description: "Track top performers and achievements on the All-Rounder leaderboard.",
  alternates: {
    canonical: "/leaderboard",
  },
  openGraph: {
    title: "Leaderboard | All-Rounder",
    description: "Track top performers and achievements on the All-Rounder leaderboard.",
    url: "https://all-rounder.lk/leaderboard",
    type: "website",
  },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
