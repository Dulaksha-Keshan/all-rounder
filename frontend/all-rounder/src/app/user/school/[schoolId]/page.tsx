"use client";

import { useParams } from "next/navigation";
import { useSchoolStore } from "@/context/useSchoolStore";
import { useStudentStore } from "@/context/useStudentStore";
import { useTeacherStore } from "@/context/useTeacherStore";
import { School, Student, Teacher } from "@/app/_type/type";
import SchoolHeader from "./SchoolHeader";
import SchoolTabs from "./SchoolTabs";



export default function SchoolProfilePage() {
  const { schoolId } = useParams();

  const { getSchoolById } = useSchoolStore();
  const { students: allStudents } = useStudentStore();
  const { teachers: allTeachers } = useTeacherStore();

  const school = getSchoolById(schoolId as string);

  const students = allStudents.filter(
    (s) => s.schoolId === schoolId
  );

  const teachers = allTeachers.filter(
    (t) => t.schoolId === schoolId
  );

  if (!school) {
    return <p className="p-6 text-gray-500">School not found</p>;
  }

  return (
    <div className="bg-[#F6F5FF] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <SchoolHeader school={school} />
        <SchoolTabs
          school={school}
          students={students}
          teachers={teachers}
        />
      </div>
    </div>
  );

}
