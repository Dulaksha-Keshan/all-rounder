"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Medal,
  Star,
  Crown,
  TrendingUp,
  Award,
  Zap,
  Target,
  Calendar,
} from "lucide-react";

export default function LeaderboardPage() {
  const router = useRouter();
  


  // Sample leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      name: "Emma Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      points: 2850,
      streak: 42,
      badges: 15,
      change: "+2",
      competitions: 8,
      level: 25,
    },
    {
      rank: 2,
      name: "Alex Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      points: 2720,
      streak: 38,
      badges: 13,
      change: "0",
      competitions: 7,
      level: 23,
    },
    {
      rank: 3,
      name: "Sophie Williams",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      points: 2680,
      streak: 35,
      badges: 14,
      change: "+1",
      competitions: 9,
      level: 24,
    },
    {
      rank: 4,
      name: "Marcus Johnson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      points: 2540,
      streak: 29,
      badges: 11,
      change: "-1",
      competitions: 6,
      level: 22,
    },
    {
      rank: 5,
      name: "Olivia Parker",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      points: 2430,
      streak: 31,
      badges: 12,
      change: "+3",
      competitions: 7,
      level: 21,
    },
    {
      rank: 6,
      name: "Ryan Thompson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      points: 2310,
      streak: 26,
      badges: 10,
      change: "-2",
      competitions: 5,
      level: 20,
    },
    {
      rank: 7,
      name: "Ava Martinez",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      points: 2190,
      streak: 24,
      badges: 9,
      change: "0",
      competitions: 6,
      level: 19,
    },
    {
      rank: 8,
      name: "Ethan Davis",
      avatar:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop",
      points: 2080,
      streak: 22,
      badges: 8,
      change: "+1",
      competitions: 5,
      level: 18,
    },
    {
      rank: 9,
      name: "Isabella Lee",
      avatar:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop",
      points: 1950,
      streak: 20,
      badges: 7,
      change: "-1",
      competitions: 4,
      level: 17,
    },
    {
      rank: 10,
      name: "Noah Anderson",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      points: 1820,
      streak: 18,
      badges: 6,
      change: "+2",
      competitions: 4,
      level: 16,
    },
  ];

  const currentUser = {
    rank: 15,
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    points: 1520,
    streak: 14,
    badges: 5,
    change: "+1",
    competitions: 3,
    level: 14,
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
            <Medal className="w-6 h-6 text-white" />
          </div>
        );
      case 3:
        return (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <Medal className="w-6 h-6 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] text-white flex items-center justify-center">
            {rank}
          </div>
        );
    }
  };

  const getRankChangeIcon = (change: string) => {
    if (change.startsWith("+"))
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change.startsWith("-"))
      return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF] py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#34365C] mb-2 text-3xl font-semibold">
            Weekly Leaderboard
          </h1>
          <p className="text-gray-600">
            Compete with students nationwide and climb to the top!
          </p>
        </div>


        {/* Leaderboard List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white">
            <h2 className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Week of January 5, 2026
            </h2>
          </div>

          <div className="divide-y">
            {leaderboardData.map((user) => (
              <div key={user.rank} className="p-4 flex items-center gap-4">
                {getRankBadge(user.rank)}
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-[#34365C]">{user.name}</p>
                  <p className="text-sm text-gray-500">Level {user.level}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getRankChangeIcon(user.change)}
                  <span>{user.change !== "0" ? user.change : "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation */}
        <div className="mt-8 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-xl p-8 text-white text-center">
          <Star className="w-12 h-12 mx-auto mb-4" />
          <h3 className="mb-2 text-xl font-semibold">Keep Climbing!</h3>
          <p className="mb-4">
            Participate in more competitions to earn points and climb the leaderboard.
          </p>
          <button
            onClick={() => router.push("/competitions")}
            className="px-6 py-3 bg-white text-[#34365C] rounded-lg hover:bg-gray-100"
          >
            Browse Competitions
          </button>
        </div>
      </div>
    </div>
  );
}
