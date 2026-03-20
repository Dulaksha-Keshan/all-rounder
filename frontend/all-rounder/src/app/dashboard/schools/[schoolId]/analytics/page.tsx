"use client";

import { use, useEffect } from "react";
import EventsAnalytics from "@/app/dashboard/_components/EventsAnalytics";
import CountChartContainer from "@/app/dashboard/_components/CountChartContainer";
import GoBackButton from "@/components/GoBackButton";
import { useSchoolStore } from "@/context/useSchoolStore";

interface SchoolAnalyticsPageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

export default function SchoolAnalyticsPage({ params }: SchoolAnalyticsPageProps) {
  const { schoolId } = use(params);
  const { fetchSchoolStudents, schoolStudentBreakdownBySchoolId } = useSchoolStore();

  useEffect(() => {
    void fetchSchoolStudents(schoolId);
  }, [fetchSchoolStudents, schoolId]);

  const breakdown = schoolStudentBreakdownBySchoolId[schoolId];
  const boysCount = breakdown?.male ?? 0;
  const girlsCount = breakdown?.female ?? 0;

  return (
    <div className="p-6">
      <div className="mb-4">
        <GoBackButton variant="solid" />
      </div>

      <div className="mb-6 max-w-md">
        <CountChartContainer schoolId={schoolId} boysOverride={boysCount} girlsOverride={girlsCount} />
      </div>

      <EventsAnalytics organizerId={schoolId} type="School" />
    </div>
  );
}