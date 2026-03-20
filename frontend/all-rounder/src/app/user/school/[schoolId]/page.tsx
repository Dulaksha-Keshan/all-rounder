"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSchoolStore } from "@/context/useSchoolStore";
import { useUserStore } from "@/context/useUserStore";
import SchoolHeader from "./SchoolHeader";
import SchoolTabs from "./SchoolTabs";

export default function SchoolProfilePage() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const resolvedSchoolId = String(schoolId || "");
  const [isClientReady, setIsClientReady] = useState(false);

  // Stores
  const { currentUser, userRole } = useUserStore();
  const { activeSchool, getSchoolById, schools, fetchSchools, fetchSchoolById, isLoading } = useSchoolStore();

  // Fetch schools on direct URL load if they aren't in memory yet
  useEffect(() => {
    if (schools.length === 0) fetchSchools();
  }, [schools.length, fetchSchools]);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // Ensure this specific school is available for view mode scenarios.
  useEffect(() => {
    if (!resolvedSchoolId) return;

    const schoolFromList = getSchoolById(resolvedSchoolId);
    const schoolFromActive =
      activeSchool && String((activeSchool as any).school_id || (activeSchool as any).id || "") === resolvedSchoolId
        ? activeSchool
        : null;

    if (!schoolFromList && !schoolFromActive) {
      void fetchSchoolById(resolvedSchoolId);
    }
  }, [resolvedSchoolId, activeSchool, getSchoolById, fetchSchoolById]);

  const schoolFromList = getSchoolById(resolvedSchoolId);
  const schoolFromActive =
    activeSchool && String((activeSchool as any).school_id || (activeSchool as any).id || "") === resolvedSchoolId
      ? activeSchool
      : null;
  const school = schoolFromActive || schoolFromList;

  // Security Check: Is the logged-in user the admin of THIS specific school?
  // We check the role AND verify their database school_id matches the URL param
  const adminSchoolId = String(currentUser?.school_id || activeSchool?.school_id || "");
  const isAdmin = userRole === 'SCHOOL_ADMIN' && adminSchoolId === resolvedSchoolId;

  if (!isClientReady || !school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF]">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading School...</h2>
          <p className="text-gray-500">Please wait while we prepare the school profile.</p>
        </div>
      </div>
    );
  }

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
