import EventsAnalytics from "@/app/dashboard/_components/EventsAnalytics";

interface SchoolAnalyticsPageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

export default async function SchoolAnalyticsPage({ params }: SchoolAnalyticsPageProps) {
  const { schoolId } = await params;
  
  return <EventsAnalytics organizerId={schoolId} type="School" />;
}