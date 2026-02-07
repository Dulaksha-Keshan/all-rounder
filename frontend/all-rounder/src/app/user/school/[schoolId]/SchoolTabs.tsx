/*"use client";

import { useState } from "react";
import { School, Student, Teacher } from "@/app/_type/type";

import SchoolOverviewTab from "./SchoolOverviewTab"
import SchoolEventsTab from "./SchoolEventsTab";
import SchoolAchievementsTab from "./SchoolAchievementsTab";

const tabs = ["Overview", "Events", "Achievements"];

export default function SchoolTabs({
  school,
  students,
  teachers,
}: {
  school: School;
  students: Student[];
  teachers: Teacher[];
}) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <>
      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm ${
              activeTab === tab
                ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <SchoolOverviewTab
          school={school}
          students={students}
          teachers={teachers}
        />
      )}
      {activeTab === "Events" && <SchoolEventsTab />}
      {activeTab === "Achievements" && <SchoolAchievementsTab />}
    </>
  );
}*/
import { useState } from "react";
import { School } from "@/app/_type/type";

import SchoolOverviewTab from "./SchoolOverviewTab";
import SchoolAchievementsTab from "./SchoolAchievementsTab";
import SchoolEventsTab from "./SchoolEventsTab";

const tabs = ["Overview", "Achievements", "Events"];

export default function SchoolTabs({
  school,
}: {
  school: School;
}) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <>
      {/* TAB HEADER */}
      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm ${
              activeTab === tab
                ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "Overview" && (
        <SchoolOverviewTab school={school} />
      )}

      {activeTab === "Achievements" && (
        <SchoolAchievementsTab />
      )}

      {activeTab === "Events" && (
        <SchoolEventsTab />
      )}
    </>
  );
}

