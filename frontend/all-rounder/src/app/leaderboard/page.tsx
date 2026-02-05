"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Medal, Star, Crown, TrendingUp, Award, Zap, Target, Calendar } from "lucide-react";

export default function LeaderboardPage() {
  const router = useRouter();

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Emma Rodriguez", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", points: 2850, streak: 42, badges: 15, change: "+2", competitions: 8, level: 25 },
    { rank: 2, name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", points: 2720, streak: 38, badges: 13, change: "0", competitions: 7, level: 23 },
    { rank: 3, name: "Sophie Williams", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", points: 2680, streak: 35, badges: 14, change: "+1", competitions: 9, level: 24 },
    { rank: 4, name: "Marcus Johnson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", points: 2540, streak: 29, badges: 11, change: "-1", competitions: 6, level: 22 },
    { rank: 5, name: "Olivia Parker", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", points: 2430, streak: 31, badges: 12, change: "+3", competitions: 7, level: 21 },
    { rank: 6, name: "Ryan Thompson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", points: 2310, streak: 26, badges: 10, change: "-2", competitions: 5, level: 20 },
    { rank: 7, name: "Ava Martinez", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop", points: 2190, streak: 24, badges: 9, change: "0", competitions: 6, level: 19 },
    { rank: 8, name: "Ethan Davis", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop", points: 2080, streak: 22, badges: 8, change: "+1", competitions: 5, level: 18 },
    { rank: 9, name: "Isabella Lee", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop", points: 1950, streak: 20, badges: 7, change: "-1", competitions: 4, level: 17 },
    { rank: 10, name: "Noah Anderson", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", points: 1820, streak: 18, badges: 6, change: "+2", competitions: 4, level: 16 }
  ];

  const currentUser = {
    rank: 15,
    name: "You",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    points: 1520,
    streak: 14,
    badges: 5,
    change: "+1",
    competitions: 3,
    level: 14
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg"><Crown className="w-6 h-6 text-white" /></div>;
      case 2:
        return <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-lg"><Medal className="w-6 h-6 text-white" /></div>;
      case 3:
        return <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg"><Medal className="w-6 h-6 text-white" /></div>;
      default:
        return <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] text-white">{rank}</div>;
    }
  };

  const getRankChangeIcon = (change: string) => {
    if (change.startsWith("+")) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change.startsWith("-")) return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8F8FF] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <Star className="absolute top-0 right-1/4 w-8 h-8 text-[#DCD0FF] opacity-50 animate-pulse" />
          <Star className="absolute bottom-0 left-1/4 w-6 h-6 text-[#8387CC] opacity-40 animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#34365C] mb-2">Weekly Leaderboard</h1>
          <p className="text-gray-600">Compete with students nationwide and climb to the top!</p>
        </div>

        {/* Time Filter
        <div className="flex justify-center gap-3 mb-8">
          {["week", "month", "allTime"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter as "week" | "month" | "allTime")}
              className={`px-6 py-3 rounded-lg transition ${timeFilter === filter ? "bg-[#8387CC] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              {filter === "week" ? "This Week" : filter === "month" ? "This Month" : "All Time"}
            </button>
          ))}
        </div> */}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{currentUser.points}</p>
            <p className="text-sm text-gray-600">Your Points</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-3">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{currentUser.streak} days</p>
            <p className="text-sm text-gray-600">Current Streak</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">#{currentUser.rank}</p>
            <p className="text-sm text-gray-600">Your Rank</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl text-[#34365C] mb-1">{currentUser.badges}</p>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-[#34365C] text-center mb-8">Top Performers</h2>
          <div className="flex items-end justify-center gap-4 mb-8">
            {[1, 0, 2].map((i) => {
              const user = leaderboardData[i];
              const heightClass = i === 0 ? "h-32" : i === 1 ? "h-24" : "h-20";
              const borderColor = i === 0 ? "border-yellow-400" : i === 1 ? "border-gray-300" : "border-orange-400";
              return (
                <div key={user.rank} className="flex-1 max-w-[200px] text-center">
                  <div className="relative mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={`w-${i===0 ? '24' : '20'} h-${i===0 ? '24' : '20'} rounded-full mx-auto object-cover border-4 ${borderColor} shadow-lg`}
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <div className={`flex items-center justify-center w-${i===0 ? '10' : '8'} h-${i===0 ? '10' : '8'} rounded-full ${i===0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : i===1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 'bg-gradient-to-br from-orange-400 to-orange-600'} border-2 border-white shadow-lg`}>
                        {i===0 ? <Crown className="w-5 h-5 text-white" /> : <span className="text-white text-sm">{user.rank}</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#34365C] mb-1">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.points} points</p>
                  <div className={`${heightClass} bg-gradient-to-t ${i===0 ? 'from-yellow-400 to-yellow-500' : i===1 ? 'from-gray-300 to-gray-400' : 'from-orange-400 to-orange-500'} rounded-t-lg mt-4 flex items-center justify-center`}>
                    {i===0 ? <Crown className="w-10 h-10 text-white" /> : <Medal className="w-8 h-8 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* <div className="p-6 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white">
            <h2 className="flex items-center gap-2"><Calendar className="w-6 h-6" />Week of January 5, 2026</h2>
          </div> */}
          <div className="divide-y divide-gray-100">
            {leaderboardData.map((user) => (
              <div key={user.rank} className={`p-4 hover:bg-[#F8F8FF] transition ${user.rank <= 3 ? "bg-gradient-to-r from-[#F8F8FF] to-white" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 flex-shrink-0">{getRankBadge(user.rank)}</div>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-[#34365C] truncate">{user.name}</p>
                      <p className="text-sm text-gray-500">Level {user.level}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="text-center"><p className="text-[#34365C]">{user.points}</p><p className="text-xs text-gray-500">Points</p></div>
                    <div className="text-center"><p className="text-[#34365C]">{user.streak}</p><p className="text-xs text-gray-500">Streak</p></div>
                    <div className="text-center"><p className="text-[#34365C]">{user.competitions}</p><p className="text-xs text-gray-500">Events</p></div>
                    <div className="text-center"><p className="text-[#34365C]">{user.badges}</p><p className="text-xs text-gray-500">Badges</p></div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getRankChangeIcon(user.change)}
                    <span className={`${user.change.startsWith("+") ? "text-green-600" : user.change.startsWith("-") ? "text-red-600" : "text-gray-400"}`}>
                      {user.change !== "0" ? user.change : "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {currentUser.rank > 10 && (
              <>
                <div className="p-4 text-center text-gray-400"><p className="text-sm">...</p></div>
                <div className="p-4 bg-[#DCD0FF]/30 border-2 border-[#8387CC]">
                  <div className="flex items-center gap-4">
                    <div className="w-16 flex-shrink-0">{getRankBadge(currentUser.rank)}</div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#8387CC]" />
                      <div className="min-w-0">
                        <p className="text-[#34365C] truncate">{currentUser.name}</p>
                        <p className="text-sm text-gray-500">Level {currentUser.level}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center"><p className="text-[#34365C]">{currentUser.points}</p><p className="text-xs text-gray-500">Points</p></div>
                      <div className="text-center"><p className="text-[#34365C]">{currentUser.streak}</p><p className="text-xs text-gray-500">Streak</p></div>
                      <div className="text-center"><p className="text-[#34365C]">{currentUser.competitions}</p><p className="text-xs text-gray-500">Events</p></div>
                      <div className="text-center"><p className="text-[#34365C]">{currentUser.badges}</p><p className="text-xs text-gray-500">Badges</p></div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {getRankChangeIcon(currentUser.change)}
                      <span className="text-green-600">{currentUser.change}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Motivation Card */}
        <div className="mt-8 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-xl shadow-lg p-8 text-white text-center">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="mb-2">Keep Climbing!</h3>
          <p className="text-white/90 mb-4">
            Participate in more competitions and complete challenges to earn points and climb the leaderboard.
          </p>
          <button className="px-6 py-3 bg-white text-[#34365C] rounded-lg hover:bg-gray-100 transition" onClick={() => router.push("/competitions")}>
            Browse Competitions
          </button>
        </div>
      </div>
    </div>
  );
}
