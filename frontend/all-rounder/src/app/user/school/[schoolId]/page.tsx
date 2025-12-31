"use client";

import { useParams } from "next/navigation";
import { Schools, Students, Teachers } from "@/app/_data/data";
import { School, Student, Teacher } from "@/app/_type/type";
import SchoolHeader from "./SchoolHeader";
import SchoolTabs from "./SchoolTabs";
import Footer from "@/app/_components/Footer";


export default function SchoolProfilePage() {
  const { schoolId } = useParams();

  const school: School | undefined = Schools.find(
    (s) => s.id === schoolId
  );

  const students: Student[] = Students.filter(
    (s) => s.schoolId === schoolId
  );

  const teachers: Teacher[] = Teachers.filter(
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
