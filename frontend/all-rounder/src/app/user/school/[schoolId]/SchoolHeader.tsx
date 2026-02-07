"use client";

import Image from "next/image";
import { School } from "@/app/_type/type";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolHeader({ school }: { school: School }) {
  const router = useRouter();
  const hasLogo = Boolean(school.logoUrl);

  return (
    <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden">
          {hasLogo ? (
            <Image
              src={school.logoUrl!}
              alt={school.name}
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <Building2 className="w-8 h-8 text-indigo-500" />
          )}
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {school.name}
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </h1>
          <p className="text-sm text-gray-500">{school.location}</p>
        </div>
      </div>

      {/* EDIT BUTTON */}
      <button
        onClick={() => router.push(`/user/school/${school.id}/edit`)}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition"
      >
        Edit Profile
      </button>
    </div>
  );
}

