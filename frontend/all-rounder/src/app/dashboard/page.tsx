"use client";

import { useUserStore } from "@/context/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { userRole, currentUser } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        // If no user is logged in, redirect to home
        if (!currentUser) {
            router.push("/home");
            return;
        }

        const schoolId =
            (currentUser as any).school_id ||
            (currentUser as any).school?.school_id ||
            (currentUser as any).schoolId;
        const orgId =
            (currentUser as any).organization_id ||
            (currentUser as any).organization?.organization_id ||
            (currentUser as any).organizationId;

        switch (userRole) {
            case "STUDENT":
                // Students might not have a dashboard, send to home or profile
                router.push("/home");
                break;
            case "TEACHER":
                router.push("/home");
                break;
            case "SCHOOL_ADMIN":
                // Based on structure: /dashboard/schools/[schoolId]
                if (schoolId) {
                    router.push(`/dashboard/schools/${schoolId}`);
                } else {
                    router.push("/home");
                }
                break;
            case "ORG_ADMIN":
                if (orgId) {
                    router.push(`/dashboard/orgs/${orgId}`);
                } else {
                    router.push("/home");
                }
                break;
            default:
                router.push("/home");
        }
    }, [userRole, currentUser, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
