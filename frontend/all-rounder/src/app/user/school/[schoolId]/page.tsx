

"use client";

import { useParams } from "next/navigation";
import { useSchoolStore } from "@/context/useSchoolStore";
import { useStudentStore } from "@/context/useStudentStore";
import { useTeacherStore } from "@/context/useTeacherStore";
import SchoolHeader from "./SchoolHeader";
import SchoolTabs from "./SchoolTabs";

export default function SchoolProfilePage() {
  const { schoolId } = useParams<{ schoolId: string }>();

  const { getSchoolById } = useSchoolStore();
  const { students: allStudents } = useStudentStore();
  const { teachers: allTeachers } = useTeacherStore();

  const school = getSchoolById(schoolId as string);

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF]">
        <p className="text-gray-500">School not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <SchoolHeader school={school} />
        <SchoolTabs school={school} />
      </div>
    </div>
  );
}
