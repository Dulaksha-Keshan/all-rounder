"use client";

import { UserCog, FolderOpen, HeartHandshake, Medal, HelpCircle, CalendarPlus, LayoutDashboard, School, X, HandHelping } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import EventCreator from "./EventCreator";
import ResourceRequestCreator from "./ResourceRequestCreator";
import { useUserStore } from "@/context/useUserStore";
import { useSchoolStore } from "@/context/useSchoolStore";
import { useRouter } from "next/navigation";

const actions = [
    {
        label: "Update Profile",
        icon: UserCog,
        href: "/user/profile/edit"
    },
    {
        label: "View Resources",
        icon: FolderOpen,
        href: "/resourceSharing"
    },
    {
        label: "Support Campaigns",
        icon: HeartHandshake,
        href: "/campaigns"
    },
    {
        label: "View Leaderboard",
        icon: Medal,
        href: "/leaderboard"
    },
    {
        label: "Get Help",
        icon: HelpCircle,
        href: "/help"
    }
];

export default function QuickActions() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const isUserLoading = useUserStore((state) => state.isLoading);
    const userRole = useUserStore((state) => state.userRole);
    const currentUser = useUserStore((state) => state.currentUser);
    const activeSchool = useSchoolStore((state) => state.activeSchool);
    const getSchoolById = useSchoolStore((state) => state.getSchoolById);
    const fetchSchools = useSchoolStore((state) => state.fetchSchools);
    const setActiveSchool = useSchoolStore((state) => state.setActiveSchool);

    const schoolId =
        (currentUser as any)?.school_id ||
        (currentUser as any)?.schoolId ||
        (currentUser as any)?.school?.school_id;
    const organizationId =
        (currentUser as any)?.organization_id ||
        (currentUser as any)?.organization?.organization_id;
    const dashboardHref =
        userRole === "SCHOOL_ADMIN" && schoolId
            ? `/dashboard/schools/${schoolId}`
            : userRole === "ORG_ADMIN" && organizationId
                ? `/dashboard/orgs/${organizationId}`
                : null;

    const canCreateEvents = userRole === "SCHOOL_ADMIN" || userRole === "ORG_ADMIN";
    const canCreateResourceRequest = userRole === "SCHOOL_ADMIN" && Boolean(schoolId);
    const canViewSchoolProfile = userRole === "STUDENT" || userRole === "TEACHER";

    const handleGoToMySchool = async () => {
        if (!schoolId) return;

        let school = getSchoolById(schoolId);

        if (!school && activeSchool?.school_id === schoolId) {
            school = activeSchool;
        }

        if (!school) {
            await fetchSchools();
            school = useSchoolStore.getState().getSchoolById(schoolId);
        }

        if (school) {
            setActiveSchool(school);
        }

        router.push(`/user/school/${schoolId}`);
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const actions = containerRef.current.querySelectorAll('.action-item');
        if (actions.length === 0) return;

        gsap.killTweensOf(actions);
        gsap.fromTo(actions,
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: "back.out(1.2)"
            }
        );
    }, [currentUser, userRole, schoolId, dashboardHref, canCreateEvents, canCreateResourceRequest, canViewSchoolProfile]);

    if (!currentUser) {
        return (
            <div className="bg-[var(--white)] rounded-2xl p-6 shadow-sm border border-[var(--gray-200)] transition-colors duration-300">
                <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4" aria-busy="true" aria-live="polite">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-[88px] rounded-xl border border-[var(--gray-100)] bg-[var(--gray-50)] animate-pulse"
                        />
                    ))}
                </div>
                {!isUserLoading && (
                    <p className="mt-3 text-xs text-[var(--text-muted)]">Sign in to view personalized quick actions.</p>
                )}
            </div>
        );
    }

    return (
        <>
            <div ref={containerRef} className="bg-[var(--white)] rounded-2xl p-6 shadow-sm border border-[var(--gray-200)] transition-colors duration-300">
                <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    {canViewSchoolProfile && schoolId && (
                        <button
                            type="button"
                            onClick={() => {
                                void handleGoToMySchool();
                            }}
                            className="action-item flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--gray-50)] hover:bg-[var(--secondary-light-lavender)]/20 border border-[var(--gray-100)] transition-all group text-center"
                        >
                            <School className="w-6 h-6 text-[var(--primary-purple)] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-[var(--text-main)]">My School</span>
                        </button>
                    )}

                    {dashboardHref && (
                        <Link
                            href={dashboardHref}
                            className="action-item flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--gray-50)] hover:bg-[var(--secondary-light-lavender)]/20 border border-[var(--gray-100)] transition-all group text-center"
                        >
                            <LayoutDashboard className="w-6 h-6 text-[var(--primary-purple)] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-[var(--text-main)]">Dashboard</span>
                        </Link>
                    )}

                    {canCreateEvents && (
                        <button
                            type="button"
                            onClick={() => setIsEventModalOpen(true)}
                            className="action-item flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--gray-50)] hover:bg-[var(--secondary-light-lavender)]/20 border border-[var(--gray-100)] transition-all group text-center"
                        >
                            <CalendarPlus className="w-6 h-6 text-[var(--primary-purple)] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-[var(--text-main)]">Create Event</span>
                        </button>
                    )}

                    {canCreateResourceRequest && (
                        <button
                            type="button"
                            onClick={() => setIsResourceModalOpen(true)}
                            className="action-item flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--gray-50)] hover:bg-[var(--secondary-light-lavender)]/20 border border-[var(--gray-100)] transition-all group text-center"
                        >
                            <HandHelping className="w-6 h-6 text-[var(--primary-purple)] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-[var(--text-main)]">Create Resource</span>
                        </button>
                    )}

                    {actions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className="action-item flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--gray-50)] hover:bg-[var(--secondary-light-lavender)]/20 border border-[var(--gray-100)] transition-all group text-center"
                        >
                            <action.icon className="w-6 h-6 text-[var(--primary-purple)] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-[var(--text-main)]">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {isMounted && isEventModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsEventModalOpen(false)}
                        aria-label="Close event creator"
                    />

                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-[var(--text-main)]">Create Event</h3>
                            <button
                                type="button"
                                onClick={() => setIsEventModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <EventCreator onCreated={() => setIsEventModalOpen(false)} />
                    </div>
                </div>,
                document.body
            )}

            {isMounted && isResourceModalOpen && schoolId && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsResourceModalOpen(false)}
                        aria-label="Close resource request creator"
                    />

                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-[var(--text-main)]">Create Resource Request</h3>
                            <button
                                type="button"
                                onClick={() => setIsResourceModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <ResourceRequestCreator
                            schoolId={schoolId}
                            onCreated={() => {
                                setIsResourceModalOpen(false);
                                router.push("/resourceSharing");
                            }}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
