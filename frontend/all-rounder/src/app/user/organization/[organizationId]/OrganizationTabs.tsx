
"use client";

import { useState } from "react";
import { Organization } from "@/app/_type/type";

import OrganizationOverviewTab from "./tabs/OrganizationOverviewTab";
import OrganizationEventsTab from "./tabs/OrganizationEventsTab";
import OrganizationAnnouncementsTab from "./tabs/OrganizationAnnouncementsTab";
import OrganizationSponsoredStudentsTab from "./tabs/OrganizationSponsoredStudentsTab";

const tabs = ["Overview", "Events", "Announcements", "Sponsored Students"];

export default function OrganizationTabs({
  organization,
}: {
  organization: Organization;
}) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <>
      {/* Tab Header */}
      <div className="surface-readable-strong rounded-xl overflow-x-auto">
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

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <OrganizationOverviewTab organization={organization} />
      )}
      {activeTab === "Events" && <OrganizationEventsTab />}
      {activeTab === "Announcements" && <OrganizationAnnouncementsTab />}
      {activeTab === "Sponsored Students" && (
        <OrganizationSponsoredStudentsTab />
      )}
    </>
  );
}
