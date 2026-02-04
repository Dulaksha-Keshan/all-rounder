import EventsAnalytics from "@/app/dashboard/_components/EventsAnalytics";
import GoBackButton from "@/components/GoBackButton";

interface SchoolAnalyticsPageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

export default async function SchoolAnalyticsPage({ params }: SchoolAnalyticsPageProps) {
  const { schoolId } = await params;

  return (
    <div className="p-6">
      <div className="mb-4">
        <GoBackButton variant="solid" />
      </div>
      <EventsAnalytics organizerId={schoolId} type="School" />
    </div>
  );
}