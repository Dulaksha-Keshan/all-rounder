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
    return <div className="p-4">Student not found</div>;
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* STUDENT INFO */}
        <div className="bg-lamaSky p-4 rounded-md flex gap-4">
          <Image
            src={student.photoUrl || "/noAvatar.png"}
            alt={student.name}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-semibold">{student.name}</h1>
            <p className="text-sm text-gray-600">
              Age {student.age} · {student.sex}
            </p>
            <p className="text-xs text-gray-500">
              {student.email}
            </p>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="bg-white rounded-md p-4 h-[700px]">
          <h1 className="text-xl font-semibold mb-2">
            Student Schedule
          </h1>
          <BigCalendarContainer school={student.school} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* DETAILS */}
        <div className="bg-white p-4 rounded-md">
          <h2 className="font-semibold">Details</h2>
          <div className="text-sm text-gray-500 mt-2 space-y-1">
            <p>School: {student.school}</p>
            <p>Age: {student.age}</p>
            <p>Gender: {student.sex}</p>
            <p>
              Registered Events:{" "}
              {student.registeredEvents?.length ?? 0}
            </p>
          </div>
        </div>

        {/* SHORTCUTS */}
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-3 flex-wrap text-xs">
            <Link
              href={`/students/${student.id}/events`}
              className="p-3 rounded-md bg-lamaSkyLight"
            >
              Events
            </Link>
            <Link
              href={`/students/${student.id}/achievements`}
              className="p-3 rounded-md bg-lamaYellowLight"
            >
              Achievements
            </Link>
          </div>
        </div>

        <Performance />

      </div>
    </div>
  );
};

export default SingleStudentPage;
