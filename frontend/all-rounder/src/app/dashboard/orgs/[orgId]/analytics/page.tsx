
import { Organizations } from "@/app/_data/data";
import EventsAnalytics from "@/app/dashboard/_components/EventsAnalytics";
import Menu from "@/app/dashboard/_components/Menu";
import Image from "next/image";
import { notFound } from "next/navigation";
import GoBackButton from "@/components/GoBackButton";

interface OrgAnalyticsProps {
  params: Promise<{
    orgId: string;
  }>;
}

export default async function OrgAnalytics({ params }: OrgAnalyticsProps) {
  const { orgId } = await params;

  // Find the organization
  const org = Organizations.find((o) => o.id === orgId);

  // If organization not found, show 404
  if (!org) {
    notFound();
  }

  return (
    <div className="h-screen flex">
      {/* LEFT SIDEBAR */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-gradient-to-b from-[#34365C] to-[#4169E1] p-4 shadow-xl">
        <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="brightness-0 invert"
          />
          <span className="hidden lg:block font-bold text-white">All-Rounder</span>
        </div>
        <Menu orgId={orgId} type="Organization" />
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll p-6">
        <div className="mb-4">
          <GoBackButton variant="solid" />
        </div>
        <EventsAnalytics organizerId={orgId} type="Organization" />
      </div>
    </div>
  );
}