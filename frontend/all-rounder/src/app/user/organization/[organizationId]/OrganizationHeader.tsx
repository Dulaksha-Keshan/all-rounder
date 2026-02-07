
import Image from "next/image";
import Link from "next/link";
import { Organization } from "@/app/_type/type";

export default function OrganizationHeader({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-[#DCD0FF]/50">
      <div className="flex items-center gap-6">
        {/* Logo circle like student avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center shadow-lg overflow-hidden">
          <Image
            src={organization.logoUrl || "/images/organizations/default-org.png"}
            alt={organization.name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#34365C] flex items-center gap-3">
            {organization.name}
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
              Verified
            </span>
          </h1>
          <p className="text-gray-600 mt-1">{organization.location}</p>
        </div>

        <Link
          href={`/user/organization/${organization.id}/edit`}
          className="px-5 py-2 bg-[var(--primary-blue)] text-white rounded-lg font-bold hover:shadow-lg transition-all"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
