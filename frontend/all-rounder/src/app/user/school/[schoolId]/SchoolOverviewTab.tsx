import { School, Student, Teacher } from "@/app/_type/type";

export default function SchoolOverviewTab({
  school,
  students,
  teachers,
}: {
  school: School;
  students: Student[];
  teachers: Teacher[];
}) {
  return (
    <div className="space-y-6 mt-6">

      {/* ABOUT SCHOOL */}
      <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          About School
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          {school.name} is located in {school.location} and actively
          participates in All-Rounder programs.
        </p>
      </div>
      


      {/* STATS — SAME LOOK AS STUDENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Students" value={students.length} />
        <StatCard label="Teachers" value={teachers.length} />
        <StatCard label="Achievements" value={156} />
        <StatCard label="Events" value={28} />
      </div>

      {/* CONTACT INFORMATION */}
      <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h2>

        <div className="space-y-2 text-sm text-gray-500">
          <p><b className="text-gray-900">Email:</b> info@school.edu.lk</p>
          <p><b className="text-gray-900">Phone:</b> (+94) 77 123 4567</p>
          <p>
            <b className="text-gray-900">Website:</b>{" "}
            <span className="text-indigo-600 hover:underline cursor-pointer">
              www.school.edu.lk
            </span>
          </p>
          <p><b className="text-gray-900">Address:</b> {school.location}</p>
        </div>
      </div>

    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-indigo-600">{value}</p>
    </div>
  );
}
