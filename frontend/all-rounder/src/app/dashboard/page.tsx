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

        switch (userRole) {
            case "Student":
                // Students might not have a dashboard, send to home or profile
                router.push("/home");
                break;
            case "Teacher":
                router.push("/home");
                break;
            case "School":
                // Based on structure: /dashboard/schools/[schoolId]
                router.push(`/dashboard/schools/${currentUser.id}`);
                break;
            case "Organization":
                router.push(`/dashboard/orgs/${currentUser.id}`);
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
