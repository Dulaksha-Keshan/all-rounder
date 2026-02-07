"use client";

import { useParams } from "next/navigation";
import { Schools } from "@/app/_data/data";
import { School } from "@/app/_type/type";

import SchoolHeader from "./SchoolHeader";
import SchoolTabs from "./SchoolTabs";

export default function SchoolProfilePage() {
  const { schoolId } = useParams<{ schoolId: string }>();

  // ✅ static data lookup (friend-style)
  const school: School | undefined = Schools.find(
    (s) => s.id === schoolId
  );

  if (!school) {
    return (
      <div className="bg-[#F6F5FF] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">School not found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F5FF] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <SchoolHeader school={school} />
        <SchoolTabs school={school} />
      </div>
    </div>
  );
}
