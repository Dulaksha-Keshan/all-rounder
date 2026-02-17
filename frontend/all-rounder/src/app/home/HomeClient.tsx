"use client";

import { Suspense } from "react";

import HomeStats from "./_components/HomeStats";
import QuickActions from "./_components/QuickActions";
import SearchBar from "@/components/SearchBar";
import UpcomingEvents from "./_components/UpcomingEvents";
import Feed from "./_components/Feed";
import { useHomeStore } from "@/context/useHomeStore";
import { useUserStore } from "@/context/useUserStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useStudentStore } from "@/context/useStudentStore";
import { useTeacherStore } from "@/context/useTeacherStore";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

function HomeClientContent() {
    const { posts, stats, createPost, deletePost, editPost, likePost, commentPost } = useHomeStore();
    const { followRequests, acceptFollowRequest, declineFollowRequest, currentUser } = useUserStore();
    const { students } = useStudentStore();
    const { teachers } = useTeacherStore();
    const headerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    // Filter posts based on search query
    const filteredPosts = posts.filter(post =>
        post.content.toLowerCase().includes(searchQuery) ||
        post.author?.name.toLowerCase().includes(searchQuery)
    );

    // Filter people based on search query
    const filteredStudents = searchQuery ? students.filter(student => student.name.toLowerCase().includes(searchQuery)) : [];
    const filteredTeachers = searchQuery ? teachers.filter(teacher => teacher.name.toLowerCase().includes(searchQuery)) : [];
    const hasPeopleResults = filteredStudents.length > 0 || filteredTeachers.length > 0;

    // Handlers now directly call store actions
    const handleCreatePost = (content: string, media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[]) => {
        createPost(content, media);
    };

    const handleDeletePost = async (id: string) => {
        await deletePost(id);
    };

    const handleEdit = (id: string, newContent: string) => {
        editPost(id, newContent);
    };

    const handleLike = (id: string) => {
        likePost(id);
    };

    const handleComment = (id: string, text: string) => {
        commentPost(id, text);
    };

    useEffect(() => {
        if (!headerRef.current) return;
        gsap.fromTo(headerRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    // Helper to get ID based on user type
    const getCurrentUserId = () => {
        if (!currentUser) return undefined;
        if ('uid' in currentUser) return currentUser.uid;
        if ('organization_id' in currentUser) return currentUser.organization_id;
        return undefined;
    };
    const currentUserId = getCurrentUserId();

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-[var(--page-bg)] min-h-screen transition-colors duration-300">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div ref={headerRef}>
                    <h1 className="text-3xl font-extrabold text-[var(--text-main)]">Welcome Back!</h1>
                </div>
                <SearchBar />
            </div>

            {/* Stats Row */}
            <HomeStats stats={stats} />

            {/* People Search Results */}
            {hasPeopleResults && (
                <div className="mb-6">
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

            {/* Main Grid: Feed + Sidebar - Sidebar strictly never drops below */}
            <div className="grid grid-cols-[1fr_240px] md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-4 md:gap-6 relative">
                {/* Left Column: Feed (2 cols wide on large screens) */}
                <div>
                    <Feed
                        posts={filteredPosts}
                        onCreatePost={handleCreatePost}
                        onLike={handleLike}
                        onComment={handleComment}
                        onDelete={handleDeletePost}
                        onEdit={handleEdit}
                        currentUserId={currentUserId}
                    />
                </div>

                {/* Right Column: Sidebar (1 col wide) */}
                <div className="space-y-6">
                    <QuickActions />
                    <UpcomingEvents />
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
