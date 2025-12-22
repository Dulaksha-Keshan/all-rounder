

"use client";

import BigCalendarContainer from "@/app/dashboard/_components/BigCalendarContainer";
import Performance from "@/app/dashboard/_components/Performance";
import Image from "next/image";
import Link from "next/link";

import { Students } from "@/app/dashboard/_data/data";

const SingleStudentPage = ({
  params,
}: {
  params: { id: string };
}) => {
  const student = Students.find(
    (s) => s.id === Number(params.id)
  );

  if (!student) {
    return (
      <div className="p-4 bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] rounded-2xl text-center">
        <p className="text-[#34365C] font-semibold">Student not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* STUDENT INFO */}
        <div className="bg-gradient-to-br from-[#8387CC] to-[#4169E1] p-6 rounded-2xl flex gap-4 shadow-xl text-white">
          <div className="relative">
            <Image
              src={student.photoUrl || "/noAvatar.png"}
              alt={student.name}
              width={120}
              height={120}
              className="rounded-full object-cover ring-4 ring-white/30"
            />
            <div className="absolute -bottom-2 -right-2 bg-white text-[#4169E1] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              #{student.id}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-2">{student.name}</h1>
            <p className="text-white/90 mb-1">
              Age {student.age} · {student.sex}
            </p>
            <p className="text-sm text-white/80">
              {student.email}
            </p>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="bg-white rounded-2xl p-6 h-[700px] shadow-lg border-2 border-[#DCD0FF]/50">
          <h1 className="text-xl font-bold mb-4 text-[#34365C]">
            Student Schedule
          </h1>
          <BigCalendarContainer school={student.school} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* DETAILS */}
        <div className="bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] p-6 rounded-2xl shadow-lg border-2 border-[#8387CC]/20">
          <h2 className="font-bold text-lg text-[#34365C] mb-4">Details</h2>
          <div className="text-sm space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <span className="font-medium text-[#34365C] min-w-[100px]">School:</span>
              <span className="text-[#505485]">{student.school}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <span className="font-medium text-[#34365C] min-w-[100px]">Age:</span>
              <span className="text-[#505485]">{student.age}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <span className="font-medium text-[#34365C] min-w-[100px]">Gender:</span>
              <span className="text-[#505485]">{student.sex}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <span className="font-medium text-[#34365C] min-w-[100px]">Events:</span>
              <span className="text-[#505485]">{student.registeredEvents?.length ?? 0}</span>
            </div>
          </div>
        </div>

        {/* SHORTCUTS */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#DCD0FF]/50">
          <h1 className="text-xl font-bold text-[#34365C] mb-4">Quick Actions</h1>
          <div className="flex flex-col gap-3">
            <Link
              href={`/students/${student.id}/events`}
              className="p-4 rounded-xl bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white font-medium hover:shadow-lg transition-all text-center"
            >
              View Events
            </Link>
            <Link
              href={`/students/${student.id}/achievements`}
              className="p-4 rounded-xl bg-gradient-to-r from-[#DCD0FF] to-[#8387CC]/50 text-[#34365C] font-medium hover:shadow-lg transition-all text-center border-2 border-[#8387CC]/30"
            >
              View Achievements
            </Link>
          </div>
        </div>

        <Performance />

      </div>
    </div>
  );
};

export default SingleStudentPage;