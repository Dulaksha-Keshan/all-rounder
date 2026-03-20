
import Image from "next/image";
import Link from "next/link";
import { Organization } from "@/app/_type/type";

export default function OrganizationHeader({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <div className="surface-readable-strong rounded-xl p-8">
      <div className="flex items-center gap-6">
        {/* Logo circle like student avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center shadow-lg overflow-hidden">
          <Image
            src={"/images/organizations/default-org.png"}
            alt={organization.organization_name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#34365C] flex items-center gap-3">
            {organization.organization_name}
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
              Verified
            </span>
          </h1>
        </div>

        <Link
          href={`/user/organization/${organization.organization_id}/edit`}
          className="px-6 py-2 bg-white text-[var(--primary-blue)] border-2 border-[var(--primary-blue)] rounded-lg font-bold hover:bg-[var(--primary-blue)] hover:text-white transition-all shadow-md"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
