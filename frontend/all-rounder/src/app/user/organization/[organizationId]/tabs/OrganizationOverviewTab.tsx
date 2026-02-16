
import { Organization } from "@/app/_type/type";

export default function OrganizationOverviewTab({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <div className="space-y-6 mt-6">
      {/* ABOUT */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
        <h2 className="text-xl font-bold text-[#34365C] mb-2">
          About Organization
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {organization.organization_name} supports students, hosts events, and partners with
          schools through the All-Rounder platform.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Events Hosted" value={24} />
        <StatCard label="Students Reached" value={1250} />
        <StatCard label="Scholarships" value={18} />
        <StatCard label="Partner Schools" value={12} />
      </div>

      {/* CONTACT */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
        <h2 className="text-xl font-bold text-[#34365C] mb-4">
          Contact Information
        </h2>

        <div className="space-y-2 text-sm text-gray-600">
          <p><b>Email:</b> info@organization.lk</p>
          <p><b>Phone:</b> (+94) 77 555 8899</p>
          <p className="text-[#4169E1] hover:underline cursor-pointer">
            www.organization.lk
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50 text-center">
      <p className="text-3xl font-bold text-[#8387CC]">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}
