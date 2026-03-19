
"use client";

import { use } from "react";
import { useEffect } from "react";
import { useSchoolStore } from "@/context/useSchoolStore";
import { useEventStore } from "@/context/useEventStore";
import UserCard from "@/app/dashboard/_components/UserCard";
import CountChartContainer from "@/app/dashboard/_components/CountChartContainer";
import BigCalendarContainer from "@/app/dashboard/_components/BigCalendarContainer";
import Menu from "@/app/dashboard/_components/Menu";
import Link from "next/link";
import { notFound } from "next/navigation";
import GoBackButton from "@/components/GoBackButton";


interface SchoolDashboardProps {
  params: Promise<{
    schoolId: string;
  }>;
}

export default function SchoolDashboard({ params }: SchoolDashboardProps) {
  const { schoolId } = use(params);
  const {
    getSchoolById,
    fetchSchools,
    schools,
    fetchSchoolStatistics,
    schoolStatistics,
    isLoading: schoolsLoading
  } = useSchoolStore();
  const { events, fetchEvents, isLoading: eventsLoading } = useEventStore();

  const getNumberFromStats = (stats: any, keys: string[], fallback = 0) => {
    if (!stats) return fallback;

    for (const key of keys) {
      const value = stats?.[key];
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }
      if (typeof value === "string") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
    }

    return fallback;
  };

  const formatStatLabel = (key: string) =>
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    if (!schools.length) {
      void fetchSchools();
    }
    if (!events.length) {
      void fetchEvents(1, 100);
    }
    void fetchSchoolStatistics(schoolId);
  }, [schools.length, events.length, fetchSchools, fetchEvents, fetchSchoolStatistics, schoolId]);

  // Find the school to get its name
  const school = getSchoolById(schoolId);

  if ((schoolsLoading || eventsLoading) && !school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
        <div className="text-[var(--text-main)] font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  // If school not found, show 404
  if (!school) {
    notFound();
  }

  // Filter data by schoolId
  const schoolEvents = events.filter(
    (e) => (e.hosts || []).some((host) => host.hostType === "school" && host.hostId === schoolId)
  );

  const studentCount = getNumberFromStats(
    schoolStatistics,
    ["studentCount", "studentsCount", "totalStudents", "students", "student_count"],
    school.student_count || 0
  );
  const teacherCount = getNumberFromStats(
    schoolStatistics,
    ["teacherCount", "teachersCount", "totalTeachers", "teachers", "teacher_count"],
    school.teachers?.length || 0
  );
  const eventCount = getNumberFromStats(
    schoolStatistics,
    ["eventCount", "eventsCount", "totalEvents", "events", "event_count"],
    schoolEvents.length
  );
  const boysCount = getNumberFromStats(
    schoolStatistics,
    ["maleStudents", "boys", "boysCount", "maleCount", "male_count"],
    0
  );
  const girlsCount = getNumberFromStats(
    schoolStatistics,
    ["femaleStudents", "girls", "girlsCount", "femaleCount", "female_count"],
    0
  );

  const excludedStatKeys = new Set([
    "studentCount",
    "studentsCount",
    "totalStudents",
    "students",
    "student_count",
    "teacherCount",
    "teachersCount",
    "totalTeachers",
    "teachers",
    "teacher_count",
    "eventCount",
    "eventsCount",
    "totalEvents",
    "events",
    "event_count",
    "maleStudents",
    "boys",
    "boysCount",
    "maleCount",
    "male_count",
    "femaleStudents",
    "girls",
    "girlsCount",
    "femaleCount",
    "female_count",
  ]);

  const extraStats = schoolStatistics && typeof schoolStatistics === "object"
    ? Object.entries(schoolStatistics).filter(([key, value]) => {
      if (excludedStatKeys.has(key)) return false;
      return ["string", "number", "boolean"].includes(typeof value);
    })
    : [];

  return (

    <div className="min-h-screen flex">
      {/* LEFT SIDEBAR - Sticky */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-gradient-to-b from-[var(--primary-dark-purple)] to-[var(--primary-blue)] p-4 shadow-xl sticky top-0 h-screen overflow-y-auto scrollbar-hide">
        {/* <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            className="brightness-0 invert" 
          />
          <span className="hidden lg:block font-bold text-[var(--white)]">All-Rounder</span>
        </div> */}
        <Menu schoolId={schoolId} />
      </div>

      {/* RIGHT CONTENT - Natural Scroll */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-gradient-to-br from-[var(--secondary-pale-lavender)] via-[var(--secondary-light-lavender)]/20 to-[var(--secondary-pale-lavender)] flex-1">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-4">
              <GoBackButton variant="solid" />
            </div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[var(--primary-dark-purple)]">{school.name}</h1>
              <p className="text-gray-600">{school.address}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <UserCard
                type="student"
                schoolId={schoolId}
                count={studentCount}
                href={`/dashboard/schools/${schoolId}/students`}
              />
              <UserCard
                type="teacher"
                schoolId={schoolId}
                count={teacherCount}
                href={`/dashboard/schools/${schoolId}/teachers`}
              />

              {/* Events Card */}
              <Link
                href={`/events?schoolId=${schoolId}`}
                className="rounded-2xl bg-gradient-to-br from-[var(--primary-purple)] to-[var(--primary-blue)] p-4 flex-1 min-w-[130px] shadow-lg hover:shadow-xl transition-shadow block"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-[var(--white)]/90 px-2 py-1 rounded-full text-[var(--primary-blue)] font-semibold">
                    2024/25
                  </span>
                  <svg className="w-5 h-5 text-[var(--white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold my-4 text-[var(--white)]">
                  {eventCount}
                </h1>
                <h2 className="capitalize text-sm font-medium text-[var(--white)]/90">
                  Events
                </h2>
              </Link>
            </div>

            {extraStats.length > 0 && (
              <div className="mb-6 bg-white rounded-2xl shadow-md border border-[var(--gray-200)] p-5">
                <h2 className="text-lg font-bold text-[var(--primary-dark-purple)] mb-4">School Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {extraStats.map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-3">
                      <p className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1">{formatStatLabel(key)}</p>
                      <p className="text-base font-semibold text-[var(--text-main)]">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Students Chart */}
              <div className="lg:col-span-1">
                <CountChartContainer schoolId={schoolId} boysOverride={boysCount} girlsOverride={girlsCount} />
              </div>

              {/* Right Column - Calendar and Events */}
              <div className="lg:col-span-2 space-y-6">
                <BigCalendarContainer schoolId={schoolId} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>


  );
}