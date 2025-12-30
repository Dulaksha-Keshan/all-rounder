import Image from "next/image";
import Link from "next/link";
import { Organization } from "@/app/_type/type";

export default function OrganizationHeader({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Image
          src={organization.logoUrl || "/images/organizations/default-org.png"}
          alt={organization.name}
          width={64}
          height={64}
          className="rounded-full border"
        />

        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {organization.name}
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </h1>
          <p className="text-sm text-gray-500">{organization.location}</p>
        </div>
      </div>

      <Link
        href={`/user/organization/${organization.id}/edit`}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
      >
        Edit Profile
      </Link>
    </div>
  );
}
