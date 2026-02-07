
"use client";

import { useParams } from "next/navigation";
//import { useOrganizationStore } from "@/context/useOrganizationStore";
import { Organization } from "@/app/_type/type";
import OrganizationHeader from "./OrganizationHeader";
import OrganizationTabs from "./OrganizationTabs";
import Footer from "@/layout/Footer";
import { Organizations } from "@/app/_data/data";

export default function OrganizationProfilePage() {
  const { organizationId } = useParams<{ organizationId: string }>();

  // ✅ EXACT SAME AS FRIEND
  const organization: Organization | undefined = Organizations.find(
    (o) => o.id === organizationId
  );

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6F5FF]">
        <p className="p-6 text-gray-500 flex-grow">
          Organization not found
        </p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F6F5FF] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <OrganizationHeader organization={organization} />
        <OrganizationTabs organization={organization} />
      </div>
      <Footer />
    </div>
  );
}
