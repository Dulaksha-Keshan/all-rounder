

"use client";

import { useState } from "react";
import { School } from "@/app/_type/type";
import SchoolOverviewTab from "./SchoolOverviewTab";
import SchoolAchievementsTab from "./SchoolAchievementsTab";
import SchoolEventsTab from "./SchoolEventsTab";

const tabs = ["Overview", "Achievements", "Events"];

export default function SchoolTabs({ school }: { school: School }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-[#DCD0FF]/50 overflow-x-auto">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-[var(--primary-blue)]/5"
                  : "text-gray-500 hover:text-[#34365C]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Overview" && <SchoolOverviewTab school={school} />}
      {activeTab === "Achievements" && <SchoolAchievementsTab />}
      {activeTab === "Events" && <SchoolEventsTab />}
    </>
  );
}
