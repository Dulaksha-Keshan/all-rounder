import EventsAnalytics from "@/app/dashboard/_components/EventsAnalytics";

export default function OrgAnalyticsPage({ params }: { params: { orgId: string } }) {
  return <EventsAnalytics organizerId={params.orgId} type="Organization" />;
}