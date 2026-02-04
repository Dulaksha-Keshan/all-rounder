"use client";


import HomeStats from "./_components/HomeStats";
import QuickActions from "./_components/QuickActions";
import SearchBar from "@/components/SearchBar";
import UpcomingEvents from "./_components/UpcomingEvents";
import Feed from "./_components/Feed";
import { PostType } from "./_components/PostCard";



import { useHomeStore } from "@/context/useHomeStore";

export default function HomeClient() {
    const { posts, stats, createPost, deletePost, likePost, commentPost } = useHomeStore();

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

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-[var(--gray-50)] min-h-screen">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--primary-dark-purple)]">Welcome Back!</h1>
                    <p className="text-[var(--gray-600)] mt-1">Here's what's happening with your account.</p>
                </div>
                <SearchBar />
            </div>

            {/* Stats Row */}
            <HomeStats stats={stats} />

            {/* Main Grid: Feed + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Feed (2 cols wide on large screens) */}
                <div className="lg:col-span-2">
                    <Feed
                        posts={posts}
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
