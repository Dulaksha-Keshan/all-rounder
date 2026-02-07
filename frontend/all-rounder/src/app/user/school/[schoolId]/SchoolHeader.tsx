

"use client";

import Image from "next/image";
import { School } from "@/app/_type/type";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolHeader({ school }: { school: School }) {
  const router = useRouter();
  const hasLogo = Boolean(school.logoUrl);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-[#DCD0FF]/50">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center shadow-lg overflow-hidden">
          {hasLogo ? (
            <Image
              src={school.logoUrl!}
              alt={school.name}
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          ) : (
            <Building2 className="w-10 h-10 text-white" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#34365C] flex items-center gap-3">
            {school.name}
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
              Verified
            </span>
          </h1>
          <p className="text-gray-600 mt-1">{school.location}</p>
        </div>

        {/* Action */}
        <button
          onClick={() => router.push(`/user/school/${school.id}/edit`)}
          className="px-5 py-2 bg-[var(--primary-blue)] text-white rounded-lg font-bold hover:shadow-lg transition-all"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
