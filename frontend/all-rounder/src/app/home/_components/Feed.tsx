"use client";

import PostCreator from "./PostCreator";
import PostCard from "./PostCard";
import { Post } from '@/app/_type/type';

interface FeedProps {
    posts: Post[];
    onLike: (id: string) => void;
    onComment: (id: string, text: string) => void;
    onDelete: (id: string) => Promise<void>;
    onEdit: (id: string, newContent: string) => void;
    onCreatePost: (content: string, media?: any[]) => void;
    currentUserId?: string;
}

export default function Feed({ posts, onLike, onComment, onDelete, onEdit, onCreatePost, currentUserId }: FeedProps) {
    return (
        <div className="w-full">
            <PostCreator onCreatePost={onCreatePost} />

            <div className="space-y-6">
                {posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onLike={onLike}
                        onComment={onComment}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        currentUserId={currentUserId}
                    />
                ))}
            </div>
        </div>
    );
}
