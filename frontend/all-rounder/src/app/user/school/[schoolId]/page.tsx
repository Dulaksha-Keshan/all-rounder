"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSchoolStore } from "@/context/useSchoolStore";
import { useUserStore } from "@/context/useUserStore";
import SchoolHeader from "./SchoolHeader";
import SchoolTabs from "./SchoolTabs";

export default function SchoolProfilePage() {
  const { schoolId } = useParams<{ schoolId: string }>();

  // Stores
  const { currentUser, userRole } = useUserStore();
  const { getSchoolById, schools, fetchSchools } = useSchoolStore();

  // Fetch schools on direct URL load if they aren't in memory yet
  useEffect(() => {
    if (schools.length === 0) fetchSchools();
  }, [schools.length, fetchSchools]);

  const school = getSchoolById(schoolId as string);

  // Security Check: Is the logged-in user the admin of THIS specific school?
  // We check the role AND verify their database school_id matches the URL param
  const isAdmin = userRole === 'SCHOOL_ADMIN' && currentUser?.school_id === schoolId;

  if (!school && schools.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF]">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">School Not Found</h2>
          <p className="text-gray-500">The school you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  if (!school) return null; // Loading state while schools fetch

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 mt-20">
        {/* Pass the isAdmin prop down to control UI visibility */}
        <SchoolHeader school={school} isAdmin={isAdmin} />
        <SchoolTabs school={school} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
