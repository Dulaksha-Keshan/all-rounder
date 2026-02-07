
"use client";

import { useParams } from "next/navigation";
import { useOrganizationStore } from "@/context/useOrganizationStore";
import OrganizationHeader from "./OrganizationHeader";
import OrganizationTabs from "./OrganizationTabs";
import Footer from "@/layout/Footer";

export default function OrganizationProfilePage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { getOrganizationById } = useOrganizationStore();

  const organization = getOrganizationById(organizationId as string);

  if (!organization) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF]">
        <p className="p-6 text-gray-500 flex-grow">Organization not found</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <OrganizationHeader organization={organization} />
        <OrganizationTabs organization={organization} />
      </div>
      <Footer />
    </div>
  );
}
