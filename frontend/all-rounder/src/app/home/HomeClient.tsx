"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import HomeStats from "./_components/HomeStats";
import QuickActions from "./_components/QuickActions";
import SearchBar from "@/components/SearchBar";
import UpcomingEvents from "./_components/UpcomingEvents";
import Feed from "./_components/Feed";
import { usePostStore } from "@/context/usePostStore";
import { useUserStore } from "@/context/useUserStore";
import { useSearchParams } from "next/navigation";
import { useStudentStore } from "@/context/useStudentStore";
import { useTeacherStore } from "@/context/useTeacherStore";
import { useSchoolStore } from "@/context/useSchoolStore";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { auth } from "@/lib/firebase";

function HomeClientContent() {
    const router = useRouter();
    const pageRef = useRef<HTMLDivElement>(null);
    const feedItems = usePostStore((state) => state.feedItems);
    const postsById = usePostStore((state) => state.postsById);
    const isFetchingFeed = usePostStore((state) => state.isFetchingFeed);
    const isFetchingPosts = usePostStore((state) => state.isFetchingPosts);
    const fetchFeed = usePostStore((state) => state.fetchFeed);
    const fetchMyPosts = usePostStore((state) => state.fetchMyPosts);
    const followRequests = useUserStore((state) => state.followRequests);
    const acceptFollowRequest = useUserStore((state) => state.acceptFollowRequest);
    const declineFollowRequest = useUserStore((state) => state.declineFollowRequest);
    const currentUser = useUserStore((state) => state.currentUser);
    const students = useStudentStore((state) => state.students);
    const teachers = useTeacherStore((state) => state.teachers);
    const schools = useSchoolStore((state) => state.schools);
    const fetchSchools = useSchoolStore((state) => state.fetchSchools);
    const headerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";
    const isSearching = Boolean(searchQuery.trim());

    // Home should load feed; keep my-posts fetch for profile overview data.
    useEffect(() => {
        void fetchFeed(1, 10);
        void fetchMyPosts();
        if (schools.length === 0) {
            void fetchSchools();
        }
    }, [fetchFeed, fetchMyPosts, fetchSchools, schools.length]);

    useEffect(() => {
        if (!auth) {
            router.replace("/");
            return;
        }

        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                router.replace("/");
                return;
            }

            try {
                const token = await firebaseUser.getIdToken();
                if (!token) {
                    router.replace("/");
                }
            } catch {
                router.replace("/");
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Convert feed items to post entities only.
    const allPosts = useMemo(
        () =>
            feedItems
                .filter((item) => item.feedType === "post" && !!item.data)
                .map((item) => postsById[item.id])
                .filter(Boolean),
        [feedItems, postsById]
    );

    // Filter posts based on search query
    const filteredPosts = useMemo(
        () =>
            allPosts.filter(
                (post) =>
                    post.content.toLowerCase().includes(searchQuery) ||
                    post.title.toLowerCase().includes(searchQuery)
            ),
        [allPosts, searchQuery]
    );

    const homeStats = useMemo(() => {
        const achievementPosts = allPosts.filter((post) => post.category === "achievement");
        const achievements = achievementPosts.length;
        const contributions = achievementPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);

        const upcomingEvents = feedItems.filter((item) => {
            if (item.feedType !== "event") return false;
            const rawStart = (item.data as any)?.startDate;
            const startMs = new Date(rawStart).getTime();
            return Number.isFinite(startMs) && startMs > Date.now();
        }).length;

        return {
            achievements,
            contributions,
            events: upcomingEvents,
        };
    }, [allPosts, feedItems]);

    // Filter people based on search query
    const filteredStudents = searchQuery
        ? students.filter((student) => student.name.toLowerCase().includes(searchQuery))
        : [];
    const filteredTeachers = searchQuery
        ? teachers.filter((teacher) => teacher.name.toLowerCase().includes(searchQuery))
        : [];
    const filteredSchools = searchQuery
        ? schools.filter((school) => school.name.toLowerCase().includes(searchQuery))
        : [];
    const hasPeopleResults = filteredStudents.length > 0 || filteredTeachers.length > 0;
    const hasSchoolResults = filteredSchools.length > 0;

    useEffect(() => {
        if (!headerRef.current) return;
        gsap.fromTo(headerRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    useEffect(() => {
        if (!pageRef.current) return;

        const blocks = pageRef.current.querySelectorAll('.home-anim-item');
        gsap.fromTo(
            blocks,
            { y: 16, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.06,
                ease: "power2.out",
            }
        );
    }, [searchQuery, feedItems.length]);

    // Helper to get ID based on user type
    const getCurrentUserId = () => {
        if (!currentUser) return undefined;
        if ('uid' in currentUser) return currentUser.uid;
        if ('organization_id' in currentUser) return currentUser.organization_id;
        return undefined;
    };
    const currentUserId = getCurrentUserId();

    return (
        <div ref={pageRef} className="p-4 md:p-6 lg:p-8 bg-[var(--page-bg)] min-h-screen transition-colors duration-300">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div ref={headerRef}>
                    <h1 className="text-3xl font-extrabold text-[var(--text-main)]">Welcome Back!</h1>
                </div>
                <SearchBar />
            </div>

            {/* People Search Results */}
            {hasPeopleResults && (
                <div className="home-anim-item mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">People</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStudents.map(student => (
                            <Link
                                key={`s-${student.uid}`}
                                href={`/user/student/${student.uid}`}
                                className="flex items-center gap-3 p-3 bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--gray-200)] hover:border-[var(--primary-purple)] transition-all"
                            >
                                <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100">
                                    <Image src={student.profile_picture || "/icons/Avatar.png"} alt={student.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-[var(--text-main)]">{student.name}</h3>
                                    <p className="text-xs text-[var(--text-muted)]">Student</p>
                                </div>
                            </Link>
                        ))}
                        {filteredTeachers.map(teacher => (
                            <Link
                                key={`t-${teacher.uid}`}
                                href={`/user/teacher/${teacher.uid}`}
                                className="flex items-center gap-3 p-3 bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--gray-200)] hover:border-[var(--primary-purple)] transition-all"
                            >
                                <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100">
                                    <Image src={teacher.profile_picture || "/icons/Avatar.png"} alt={teacher.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-[var(--text-main)]">{teacher.name}</h3>
                                    <p className="text-xs text-[var(--text-muted)]">Teacher</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* School Search Results */}
            {hasSchoolResults && (
                <div className="home-anim-item mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">Schools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSchools.map((school) => (
                            <Link
                                key={`school-${school.school_id}`}
                                href={`/user/school/${school.school_id}`}
                                className="flex items-center gap-3 p-3 bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--gray-200)] hover:border-[var(--primary-blue)] transition-all"
                            >
                                <div className="w-10 h-10 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center text-[var(--primary-blue)] font-bold">
                                    {school.name?.charAt(0).toUpperCase() || "S"}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm text-[var(--text-main)] truncate">{school.name}</h3>
                                    <p className="text-xs text-[var(--text-muted)] truncate">{school.district}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Grid: Feed + Sidebar - Sidebar strictly never drops below */}
            <div className="home-anim-item grid grid-cols-[1fr_240px] md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-4 md:gap-6 relative">
                {/* Left Column: Feed (2 cols wide on large screens) */}
                <div>
                    <Feed
                        posts={filteredPosts}
                        isLoading={isFetchingFeed || isFetchingPosts}
                    />
                </div>

                {/* Right Column: Sidebar (1 col wide) */}
                <div className="space-y-6">
                    {!isSearching && <HomeStats stats={homeStats} compact />}
                    <QuickActions />
                    {!isSearching && <UpcomingEvents />}
                </div>
            </div>
        </div>
    );
}
export default function HomeClient() {
    return (
        <Suspense fallback={<div>Loading Home...</div>}>
            <HomeClientContent />
        </Suspense>
    );
}
