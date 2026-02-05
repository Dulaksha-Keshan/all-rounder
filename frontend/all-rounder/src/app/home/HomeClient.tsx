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
import { Students, Teachers } from "@/app/_data/data";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

function HomeClientContent() {
    const { posts, stats, createPost, deletePost, likePost, commentPost } = useHomeStore();
    const { followRequests, acceptFollowRequest, declineFollowRequest } = useUserStore();
    const headerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    // Filter posts based on search query
    const filteredPosts = posts.filter(post =>
        post.content.toLowerCase().includes(searchQuery) ||
        post.author.name.toLowerCase().includes(searchQuery)
    );

    // Filter people based on search query
    const filteredStudents = searchQuery ? Students.filter(student => student.name.toLowerCase().includes(searchQuery)) : [];
    const filteredTeachers = searchQuery ? Teachers.filter(teacher => teacher.name.toLowerCase().includes(searchQuery)) : [];
    const hasPeopleResults = filteredStudents.length > 0 || filteredTeachers.length > 0;

    // Handlers now directly call store actions
    const handleCreatePost = (content: string, media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[]) => {
        createPost(content, media);
    };

    const handleDeletePost = (id: number) => {
        deletePost(id);
    };

    const handleLike = (id: number) => {
        likePost(id);
    };

    const handleComment = (id: number, text: string) => {
        commentPost(id, text);
    };

    useEffect(() => {
        if (!headerRef.current) return;
        gsap.fromTo(headerRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

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
                                key={`s-${student.id}`}
                                href={`/user/student/${student.id}`}
                                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-[var(--gray-200)] hover:border-[var(--primary-purple)] transition-all"
                            >
                                <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100">
                                    <Image src={student.photoUrl || "/icons/Avatar.png"} alt={student.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-[var(--text-main)]">{student.name}</h3>
                                    <p className="text-xs text-[var(--text-muted)]">Student</p>
                                </div>
                            </Link>
                        ))}
                        {filteredTeachers.map(teacher => (
                            <Link
                                key={`t-${teacher.id}`}
                                href={`/user/teacher/${teacher.id}`}
                                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-[var(--gray-200)] hover:border-[var(--primary-purple)] transition-all"
                            >
                                <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100">
                                    <Image src={teacher.photoUrl || "/icons/Avatar.png"} alt={teacher.name} fill className="object-cover" />
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
