import { Organization } from "@/app/_type/type";

export default function OrganizationOverviewTab({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <div className="space-y-6 mt-6">

      {/* ABOUT */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          About Organization
        </h2>
        <p className="text-sm text-gray-600">
          {organization.name} supports students, hosts events, and partners
          with schools through the All-Rounder platform.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard label="Events Hosted" value={24} />
        <StatCard label="Students Reached" value={1250} />
        <StatCard label="Scholarships" value={18} />
        <StatCard label="Partner Schools" value={12} />
      </div>

      {/* CONTACT */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h2>

        <div className="space-y-2 text-sm text-gray-600">
          <p><b>Email:</b> info@organization.lk</p>
          <p><b>Phone:</b> (+94) 77 555 8899</p>
          <p className="text-indigo-500 hover:underline cursor-pointer">
            www.organization.lk
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6 text-center">
      <p className="text-2xl font-semibold text-indigo-600">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
