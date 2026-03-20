"use client";

import { Trophy, Calendar, Heart, Users, UserPlus } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useUserStore } from "@/context/useUserStore";
import { usePostStore } from "@/context/usePostStore";
import gsap from "gsap";

interface HomeStatsProps {
    stats: {
        achievements: number;
        events: number;
        contributions: number;
    };
    compact?: boolean;
}

export default function HomeStats({ stats, compact = false }: HomeStatsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const followers = useUserStore((state) => state.followers);
    const following = useUserStore((state) => state.following);
    const userRole = useUserStore((state) => state.userRole);
    const currentUser = useUserStore((state) => state.currentUser);
    const postsById = usePostStore((state) => state.postsById);
    const myPostIds = usePostStore((state) => state.myPostIds);
    const fetchSchoolAchievementPosts = usePostStore((state) => state.fetchSchoolAchievementPosts);
    const getSchoolAchievementPosts = usePostStore((state) => state.getSchoolAchievementPosts);
    const schoolAchievementPaginationBySchoolId = usePostStore(
        (state) => state.schoolAchievementPaginationBySchoolId
    );

    const showSocialStats = userRole !== "SCHOOL_ADMIN" && userRole !== "ORG_ADMIN";

    const schoolId =
        (currentUser as any)?.school_id ||
        (currentUser as any)?.schoolId ||
        (currentUser as any)?.school?.school_id;

    useEffect(() => {
        if (userRole !== "SCHOOL_ADMIN" || !schoolId) return;
        void fetchSchoolAchievementPosts(schoolId, 1, 200);
    }, [userRole, schoolId, fetchSchoolAchievementPosts]);

    const myAchievementsCount = useMemo(() => {
        if (userRole !== "STUDENT" && userRole !== "TEACHER") {
            return stats.achievements;
        }

        return myPostIds.reduce((count, postId) => {
            const post = postsById[postId];
            if (!post) return count;
            return post.category === "achievement" ? count + 1 : count;
        }, 0);
    }, [userRole, myPostIds, postsById, stats.achievements]);

    const schoolAdminAchievementsCount =
        userRole === "SCHOOL_ADMIN" && schoolId
            ? schoolAchievementPaginationBySchoolId[schoolId]?.totalItems ?? 0
            : stats.achievements;

    const myContributionsCount = useMemo(() => {
        if (userRole !== "STUDENT" && userRole !== "TEACHER") {
            return stats.contributions;
        }

        return myPostIds.reduce((sum, postId) => {
            const post = postsById[postId];
            if (!post || post.category !== "achievement") return sum;
            return sum + (post.likeCount || 0);
        }, 0);
    }, [userRole, myPostIds, postsById, stats.contributions]);

    const schoolAdminContributionsCount = useMemo(() => {
        if (userRole !== "SCHOOL_ADMIN" || !schoolId) {
            return stats.contributions;
        }

        const schoolAchievementPosts = getSchoolAchievementPosts(schoolId);
        return schoolAchievementPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    }, [userRole, schoolId, getSchoolAchievementPosts, stats.contributions]);

    const displayAchievements =
        userRole === "SCHOOL_ADMIN"
            ? schoolAdminAchievementsCount
            : userRole === "STUDENT" || userRole === "TEACHER"
                ? myAchievementsCount
                : stats.achievements;

    const displayContributions =
        userRole === "SCHOOL_ADMIN"
            ? schoolAdminContributionsCount
            : userRole === "STUDENT" || userRole === "TEACHER"
                ? myContributionsCount
                : stats.contributions;

    const statItems = [
        ...(showSocialStats ? [
            {
                label: "Followers",
                value: followers.length.toString(),
                icon: Users,
                color: "bg-purple-100 text-purple-600",
                trend: "up"
            },
            {
                label: "Following",
                value: following.length.toString(),
                icon: UserPlus,
                color: "bg-blue-100 text-blue-600",
                trend: "neutral"
            },
        ] : []),
        {
            label: "Achievements",
            value: displayAchievements.toString(),
            icon: Trophy,
            color: "bg-[var(--primary-purple)]/10 text-[var(--primary-purple)]",
            trend: "up"
        },
        {
            label: "Upcoming Events",
            value: stats.events.toString(),
            icon: Calendar,
            color: "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]",
            trend: "up"
        },
        {
            label: "Contributions",
            value: displayContributions.toString(),
            icon: Heart,
            color: "bg-pink-500/10 text-pink-500",
            trend: "up"
        }
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        const cards = containerRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(cards,
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }
        );
    }, []);

    return (
        <div
            ref={containerRef}
            className={compact
                ? "grid grid-cols-1 gap-3"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6"
            }
        >
            {statItems.map((stat, index) => (
                <div
                    key={index}
                    className={`stat-card bg-[var(--white)] rounded-2xl shadow-sm border border-[var(--gray-200)] hover:shadow-md transition-all duration-300 opacity-0 ${compact ? "p-3" : "p-4"}`}
                >
                    <div className={`flex justify-between items-start ${compact ? "mb-2" : "mb-4"}`}>
                        <div className={`${compact ? "p-2" : "p-3"} rounded-xl ${stat.color}`}>
                            <stat.icon size={compact ? 16 : 20} />
                        </div>
                        {stat.trend === "up" && (
                            <span className="text-green-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </span>
                        )}
                    </div>
                    <div>
                        <p className={`${compact ? "text-xs" : "text-sm"} font-medium text-[var(--gray-600)] mb-1`}>{stat.label}</p>
                        <h3 className={`${compact ? "text-xl" : "text-2xl"} font-bold text-[var(--primary-dark-purple)]`}>{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
