"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  Share2,
  Plus,
  Sparkles,
} from "lucide-react";

export default function DonationsPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "myCampaigns">(
    "campaigns"
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Observe class changes on html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const campaigns = [
    {
      id: 1,
      title: "New Science Lab Equipment",
      school: "Lincoln High School",
      description:
        "Raise funds for modern microscopes and lab equipment to enhance STEM education",
      goal: 50000000,
      raised: 35000000,
      donors: 142,
      daysLeft: 15,
      category: "Equipment",
    },
    {
      id: 2,
      title: "Music Program Instruments",
      school: "Washington Arts Academy",
      description:
        "Help students pursue their musical dreams with quality instruments",
      goal: 30000000,
      raised: 28500000,
      donors: 89,
      daysLeft: 8,
      category: "Arts",
    },
    {
      id: 3,
      title: "Scholarship Fund",
      school: "Community Education Foundation",
      description:
        "Provide full-year scholarships to students from low-income families",
      goal: 100000000,
      raised: 62000000,
      donors: 234,
      daysLeft: 30,
      category: "Scholarship",
    },
  ];

  const getProgress = (r: number, g: number) =>
    Math.min((r / g) * 100, 100);

  const formatLKR = (amount: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="relative min-h-screen overflow-hidden bg-page-bg transition-colors duration-300">
      {/* Decorative Background - adjusted opacity for dark mode */}
      <div className={`absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#8387CC]/30 to-[#4169E1]/30 ${isDarkMode ? 'dark:opacity-20' : ''} blur-3xl rounded-full transition-opacity duration-300`} />
      <div className={`absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-[#DCD0FF]/40 to-[#8387CC]/30 ${isDarkMode ? 'dark:opacity-20' : ''} blur-3xl rounded-full transition-opacity duration-300`} />

      <div className="relative max-w-7xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8387CC]/20 to-[#4169E1]/20 dark:from-[#8387CC]/10 dark:to-[#4169E1]/10 text-[#4169E1] dark:text-[#8387CC] mb-4 transition-colors duration-300">
            <Sparkles className="w-4 h-4" />
            Transparent Education Funding
          </div>
          <h1 className="text-4xl font-bold text-main mb-2 transition-colors duration-300">
            Donations & Sponsorship
          </h1>
          <p className="text-muted max-w-2xl transition-colors duration-300">
            Empower education through transparent, community-driven fundraising
            with real-time impact tracking.
          </p>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-10">
          {["campaigns", "myCampaigns"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#8387CC] to-[#4169E1] dark:from-[#505485] dark:to-[#34365C] text-white shadow-lg"
                  : "bg-card dark:bg-card text-main hover:bg-[#F8F8FF] dark:hover:bg-gray-100/10"
              }`}
            >
              {tab === "campaigns" ? "Active Campaigns" : "My Campaigns"}
            </button>
          ))}

          <button className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#2f4fd4] dark:from-[#505485] dark:to-[#34365C] text-white shadow-lg hover:scale-[1.02] transition-transform duration-300 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Campaign
          </button>
        </div>

        {/* CAMPAIGNS */}
        {activeTab === "campaigns" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="group relative bg-gradient-to-br from-white via-[#F8F8FF] to-[#EEF0FF] dark:from-card dark:via-gray-100/5 dark:to-gray-100/10 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#8387CC]/20 to-[#4169E1]/20 dark:from-[#8387CC]/10 dark:to-[#4169E1]/10" />

                {/* Icon Header */}
                <div className="relative h-36 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] dark:from-[#505485] dark:to-[#34365C] flex items-center justify-center shadow-lg transition-all duration-300">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="relative p-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#DCD0FF] dark:bg-[#505485]/30 text-[#505485] dark:text-[#DCD0FF] transition-colors duration-300">
                      {c.category}
                    </span>
                    <span className="text-xs text-muted transition-colors duration-300">
                      {c.daysLeft} days left
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-main transition-colors duration-300">
                    {c.title}
                  </h3>
                  <p className="text-sm text-muted mb-3 transition-colors duration-300">{c.school}</p>
                  <p className="text-sm text-muted mb-5 transition-colors duration-300">
                    {c.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-main transition-colors duration-300">{formatLKR(c.raised)}</span>
                      <span className="text-muted transition-colors duration-300">
                        {formatLKR(c.goal)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#8387CC] to-[#4169E1] dark:from-[#505485] dark:to-[#34365C] transition-all duration-300"
                        style={{ width: `${getProgress(c.raised, c.goal)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-muted transition-colors duration-300">
                      <Users className="w-4 h-4" />
                      {c.donors}
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-[#F8F8FF] dark:bg-gray-100/10 hover:bg-[#DCD0FF] dark:hover:bg-[#505485]/30 transition-all duration-300">
                        <Share2 className="w-4 h-4 text-[#505485] dark:text-[#DCD0FF] transition-colors duration-300" />
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4169E1] to-[#2f4fd4] dark:from-[#505485] dark:to-[#34365C] text-white hover:scale-[1.05] transition-all duration-300 text-sm">
                        Donate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MY CAMPAIGNS */}
        {activeTab === "myCampaigns" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card dark:bg-card rounded-2xl shadow-lg p-8 transition-colors duration-300">
              <h3 className="text-xl font-semibold text-main mb-6 transition-colors duration-300">
                My Campaign Overview
              </h3>

              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Stat icon={<DollarSign />} label="Raised" value={formatLKR(35000000)} />
                <Stat icon={<Target />} label="Goal" value={formatLKR(50000000)} />
                <Stat icon={<Users />} label="Donors" value="142" />
                <Stat icon={<Calendar />} label="Days Left" value="15" />
              </div>

              <h4 className="font-semibold text-main mb-4 transition-colors duration-300">
                Recent Donations
              </h4>

              {["Tech Corp Foundation", "Anonymous Donor", "Parent Association"].map(
                (d, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 mb-3 rounded-xl bg-[#F8F8FF] dark:bg-gray-100/5 transition-colors duration-300"
                  >
                    <span className="text-main transition-colors duration-300">{d}</span>
                    <span className="text-[#4169E1] dark:text-[#8387CC] font-medium transition-colors duration-300">
                      {formatLKR(2500000)}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="bg-gradient-to-br from-[#8387CC] to-[#4169E1] dark:from-[#505485] dark:to-[#34365C] rounded-2xl p-8 text-white shadow-xl transition-all duration-300">
              <TrendingUp className="w-12 h-12 mb-4" />
              <h4 className="text-lg font-semibold mb-2">
                Campaign Performance
              </h4>
              <p className="text-sm text-[#DCD0FF] dark:text-[#8387CC] mb-6 transition-colors duration-300">
                Your campaign is outperforming 35% of similar fundraisers.
              </p>
              <button className="w-full py-3 rounded-lg bg-white dark:bg-gray-100 text-[#34365C] dark:text-[#34365C] font-medium hover:bg-[#DCD0FF] dark:hover:bg-[#8387CC]/20 transition-all duration-300">
                View Analytics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl p-4 bg-gradient-to-br from-[#F8F8FF] to-[#EEF0FF] dark:from-gray-100/5 dark:to-gray-100/10 transition-colors duration-300">
      <div className="w-8 h-8 text-[#4169E1] dark:text-[#8387CC] mb-2 transition-colors duration-300">
        {icon}
      </div>
      <p className="text-sm text-muted transition-colors duration-300">{label}</p>
      <p className="text-lg font-semibold text-main transition-colors duration-300">{value}</p>
    </div>
  );
}