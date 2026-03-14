"use client";

import Image from "next/image";
import { School } from "@/app/_type/type";
import { Building2 } from "lucide-react"; // Kept if you want to use it later
import { useRouter } from "next/navigation";

interface SchoolHeaderProps {
  school: School;
  isAdmin: boolean;
}

export default function SchoolHeader({ school, isAdmin }: SchoolHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-[#DCD0FF]/50">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center shadow-lg overflow-hidden shrink-0">
          <Image
            src={"/images/schools/default-school.png"}
            alt={school.name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#34365C] flex items-center gap-3">
            {school.name}
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
              Verified
            </span>
          </h1>
          <p className="text-gray-600 mt-1">{school.address}</p>
        </div>

        {/* Action - ONLY VISIBLE TO THE SCHOOL ADMIN */}
        {isAdmin && (
          <button
            onClick={() => router.push(`/user/school/${school.school_id}/edit`)}
            className="px-5 py-2 bg-[var(--primary-blue)] text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}