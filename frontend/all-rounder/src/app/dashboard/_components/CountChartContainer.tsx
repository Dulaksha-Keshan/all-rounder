

"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import CountChart from "./CountChart";
import { useStudentStore } from "@/context/useStudentStore";

interface CountChartContainerProps {
  schoolId?: string;
  orgId?: string;
  boysOverride?: number;
  girlsOverride?: number;
}

const CountChartContainer = ({ schoolId, orgId, boysOverride, girlsOverride }: CountChartContainerProps) => {
  const { students } = useStudentStore();
  const cardRef = useRef<HTMLDivElement>(null);

  // Filter students based on schoolId or orgId
  let filteredStudents = students;

  if (schoolId) {
    filteredStudents = students.filter((s) => s.school_id === schoolId);
  } else if (orgId) {
    filteredStudents = students.filter((s) => s.organizationId === orgId);
  }

  // Count boys and girls from the filtered data
  const fallbackBoys = filteredStudents.filter((s) => s.sex === "MALE").length;
  const fallbackGirls = filteredStudents.filter((s) => s.sex === "FEMALE").length;
  const boys = typeof boysOverride === "number" ? boysOverride : fallbackBoys;
  const girls = typeof girlsOverride === "number" ? girlsOverride : fallbackGirls;
  const total = boys + girls;

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".student-chart-block",
        { y: 16, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [boys, girls]);

  return (
    <div ref={cardRef} className="bg-white rounded-xl w-full h-[500px] p-4">
      {/* TITLE */}
      <div className="student-chart-block flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src='/images/Dashboard/maleFemale.webp' alt="Male Female" width={20} height={20} />
      </div>

      {/* CHART */}
      {total > 0 ? (
        <>
          <CountChart boys={boys} girls={girls} />

          {/* BOTTOM */}
          <div className="flex justify-center gap-16 mt-4">
            <div className="student-chart-block flex flex-col gap-1 items-center">
              <div className="w-5 h-5 bg-blue-500 rounded-full" />
              <h1 className="font-bold">{boys}</h1>
              <h2 className="text-xs text-gray-500">
                Boys ({Math.round((boys / total) * 100)}%)
              </h2>
            </div>
            <div className="student-chart-block flex flex-col gap-1 items-center">
              <div className="w-5 h-5 bg-purple-500 rounded-full" />
              <h1 className="font-bold">{girls}</h1>
              <h2 className="text-xs text-gray-500">
                Girls ({Math.round((girls / total) * 100)}%)
              </h2>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          No student data available
        </div>
      )}
    </div>
  );
};

export default CountChartContainer;

