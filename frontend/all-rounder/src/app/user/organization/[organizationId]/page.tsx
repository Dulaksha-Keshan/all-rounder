"use client";

import { useParams } from "next/navigation";
import { Organizations } from "@/app/_data/data";
import { Organization } from "@/app/_type/type";

import OrganizationHeader from "./OrganizationHeader";
import OrganizationTabs from "./OrganizationTabs";

export default function OrganizationProfilePage() {
  const { organizationId } = useParams();

  const organization: Organization | undefined = Organizations.find(
    (o) => o.id === organizationId
  );

  if (!organization) {
    return <p className="p-6 text-gray-500">Organization not found</p>;
  }

  return (
    <div className="bg-[#F6F5FF] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <OrganizationHeader organization={organization} />
        <OrganizationTabs organization={organization} />
      </div>
    </div>
  );
}
