/*import { School, Student, Teacher } from "@/app/_type/type";

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

      {/* ABOUT SCHOOL */
/*<div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-2">
    About School
  </h2>
  <p className="text-sm text-gray-500 leading-relaxed">
    {school.name} is located in {school.address} and actively
    participates in All-Rounder programs.
  </p>
</div>
 


{/* STATS — SAME LOOK AS STUDENT */
/*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard label="Students" value={students.length} />
  <StatCard label="Teachers" value={teachers.length} />
  <StatCard label="Achievements" value={156} />
  <StatCard label="Events" value={28} />
</div>

{/* CONTACT INFORMATION */
/* <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6">
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
}*/
// import { School } from "@/app/_type/type";

// export default function SchoolOverviewTab({
//   school,
// }: {
//   school: School;
// }) {
//   return (
//     <div className="space-y-6 mt-6">
//       {/* ABOUT */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h2 className="text-lg font-semibold text-gray-900 mb-2">
//           About School
//         </h2>
//         <p className="text-sm text-gray-600">
//           {school.name} is located in {school.location} and supports
//           students through the All-Rounder platform.
//         </p>
//       </div>

//       {/* STATS (placeholder for now) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <StatCard label="Students" value={0} />
//         <StatCard label="Teachers" value={0} />
//         <StatCard label="Events" value={0} />
//         <StatCard label="Achievements" value={0} />
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   label,
//   value,
// }: {
//   label: string;
//   value: number;
// }) {
//   return (
//     <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6 text-center">
//       <p className="text-2xl font-semibold text-indigo-600">{value}</p>
//       <p className="text-sm text-gray-500 mt-1">{label}</p>
//     </div>
//   );
// }

// import { School } from "@/app/_type/type";

// export default function SchoolOverviewTab({ school }: { school: School }) {
//   return (
//     <div className="space-y-6 mt-6">
//       {/* ABOUT */}
//       <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
//         <h2 className="text-xl font-bold text-[#34365C] mb-2">
//           About School
//         </h2>
//         <p className="text-sm text-gray-600 leading-relaxed">
//           {school.name} is located in {school.location} and supports students
//           through the All-Rounder platform.
//         </p>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard label="Students" value={0} />
//         <StatCard label="Teachers" value={0} />
//         <StatCard label="Events" value={0} />
//         <StatCard label="Achievements" value={0} />
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50 text-center">
//       <p className="text-3xl font-bold text-[#8387CC]">{value}</p>
//       <p className="text-sm text-gray-600 mt-1">{label}</p>
//     </div>
//   );
// }

import { School } from "@/app/_type/type";
import { useEffect, useMemo } from "react";
import { useEventStore } from "@/context/useEventStore";
import { useSchoolStore } from "@/context/useSchoolStore";
import SchoolOverviewStatsSkeleton from "../../../../../skeletons/SchoolOverviewStatsSkeleton";

export default function SchoolOverviewTab({ school }: { school: School }) {
  const resolvedSchoolId = String((school as any)?.school_id || (school as any)?.id || (school as any)?._id || "");
  const schoolStudents = useSchoolStore((state) => state.schoolStudents);
  const schoolTeachers = useSchoolStore((state) => state.schoolTeachers);
  const schoolStatisticsBySchoolId = useSchoolStore((state) => state.schoolStatisticsBySchoolId);
  const isLoading = useSchoolStore((state) => state.isLoading);
  const schoolEventsById = useEventStore((state) => state.schoolEventsById);
  const getSchoolEvents = useEventStore((state) => state.getSchoolEvents);
  const fetchSchoolEvents = useEventStore((state) => state.fetchSchoolEvents);

  const schoolStatistics = schoolStatisticsBySchoolId[resolvedSchoolId] || null;

  useEffect(() => {
    if (!resolvedSchoolId) return;
    void fetchSchoolEvents(resolvedSchoolId, 1, 100);
  }, [resolvedSchoolId, fetchSchoolEvents]);

  const schoolEventsCount = useMemo(() => {
    const events = schoolEventsById[resolvedSchoolId] || getSchoolEvents(resolvedSchoolId);
    return events.length;
  }, [schoolEventsById, getSchoolEvents, resolvedSchoolId]);

  const pickNumber = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
      return Number(value);
    }
    return null;
  };

  const getStat = (keys: string[], fallback = 0) => {
    for (const key of keys) {
      const direct = pickNumber((schoolStatistics as any)?.[key]);
      if (direct !== null) return direct;

      const nested = pickNumber((schoolStatistics as any)?.counts?.[key]);
      if (nested !== null) return nested;

      const nestedStats = pickNumber((schoolStatistics as any)?.stats?.[key]);
      if (nestedStats !== null) return nestedStats;
    }
    return fallback;
  };

  const studentsCount = getStat(["studentCount", "studentsCount", "students"], school.student_count || 0);
  const teachersCount = getStat(["teacherCount", "teachersCount", "teachers"], 0);
  const eventsCount = getStat(["eventCount", "eventsCount", "events"], schoolEventsCount);
  const achievementsCount = getStat(["achievementCount", "achievementsCount", "achievements"]);
  const shouldShowStatsSkeleton = isLoading && !schoolStatistics;

  return (
    <div className="space-y-6 mt-6">
      {/* About */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
        <h2 className="text-xl font-bold text-[#34365C] mb-2">
          About School
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {school.name} is located in {school.address} and supports students
          through the All-Rounder platform.
        </p>
      </div>

      {/* Stats */}
      {shouldShowStatsSkeleton ? (
        <SchoolOverviewStatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Students" value={studentsCount} />
          <StatCard label="Teachers" value={teachersCount} />
          <StatCard label="Events" value={eventsCount} />
          <StatCard label="Achievements" value={achievementsCount} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50 text-center">
      <p className="text-3xl font-bold text-[#8387CC]">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}
