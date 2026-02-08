"use client";

import { useParams } from "next/navigation";
import { useOrganizationStore } from "@/context/useOrganizationStore";
import { Organization } from "@/app/_type/type";
import Footer from "@/layout/Footer";

import OrganizationHeader from "./OrganizationHeader";
import OrganizationTabs from "./OrganizationTabs";

export default function OrganizationProfilePage() {
  const { organizationId } = useParams();

  const { getOrganizationById } = useOrganizationStore();
  const organization = getOrganizationById(organizationId as string);

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
      {/* FOOTER */}
      <Footer />
    </div>
  );
}
