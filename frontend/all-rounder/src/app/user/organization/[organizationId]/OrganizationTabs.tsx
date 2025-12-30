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
