"use client";

import { use } from "react";
import { useEffect } from "react";
import { useOrganizationStore } from "@/context/useOrganizationStore";
import { useEventStore } from "@/context/useEventStore";
import BigCalendarContainer from "@/app/dashboard/_components/BigCalendarContainer";
import Menu from "@/app/dashboard/_components/Menu";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GoBackButton from "@/components/GoBackButton";

interface OrgDashboardProps {
  params: Promise<{
    orgId: string;
  }>;
}

export default function OrgDashboard({ params }: OrgDashboardProps) {
  const { orgId } = use(params);
  const {
    getOrganizationById,
    fetchOrganizations,
    organizations,
    isLoading: organizationsLoading
  } = useOrganizationStore();
  const { events, fetchEvents, isLoading: eventsLoading } = useEventStore();

  useEffect(() => {
    if (!organizations.length) {
      void fetchOrganizations();
    }
    if (!events.length) {
      void fetchEvents(1, 100);
    }
  }, [organizations.length, events.length, fetchOrganizations, fetchEvents]);

  // Find the organization
  const org = getOrganizationById(orgId);

  if ((organizationsLoading || eventsLoading) && !org) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
        <div className="text-[var(--text-main)] font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  // If organization not found, show 404
  if (!org) {
    notFound();
  }

  // Filter events by organization
  const orgEvents = events.filter(
    (e) => (e.hosts || []).some((host) => host.hostType === "organization" && host.hostId === orgId)
  );
  return (
    <div className="h-screen flex">
      {/* LEFT SIDEBAR */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-gradient-to-b from-[var(--primary-dark-purple)] to-[var(--primary-blue)] p-4 shadow-xl">
        <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="brightness-0 invert"
          />
          <span className="hidden lg:block font-bold text-[var(--white)]">All-Rounder</span>
        </div>
        <Menu orgId={orgId} type="Organization" />
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-gradient-to-br from-[var(--secondary-pale-lavender)] via-[var(--secondary-light-lavender)]/20 to-[var(--secondary-pale-lavender)] overflow-scroll">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-4">
              <GoBackButton variant="solid" />
            </div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[var(--primary-dark-purple)]">{org.organization_name}</h1>
            </div>

            {/* Stats Card - Events */}
            <div className="mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-[var(--primary-purple)] to-[var(--primary-blue)] p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] bg-[var(--white)]/90 px-2 py-1 rounded-full text-[var(--primary-blue)] font-semibold">
                      2024/25
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-[var(--white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </div>
                <h1 className="text-4xl font-semibold mb-2 text-[var(--white)]">
                  {orgEvents.length}
                </h1>
                <h2 className="text-base font-medium text-[var(--white)]/90 mb-4">
                  Total Events
                </h2>

                {/* View Analytics Button */}
                <Link
                  href={`/dashboard/orgs/${orgId}/analytics`}
                  className="inline-flex items-center gap-2 bg-[var(--white)] text-[var(--primary-blue)] px-4 py-2 rounded-lg font-medium hover:bg-[var(--white)]/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="space-y-6">
              <BigCalendarContainer organizerId={orgId} type="Organization" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}