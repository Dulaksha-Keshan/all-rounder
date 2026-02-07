"use client";

import PostCreator from "./PostCreator";
import PostCard, { PostType } from "./PostCard";

interface FeedProps {
    posts: PostType[];
    onLike: (id: number) => void;
    onComment: (id: number, text: string) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, newContent: string) => void;
    onCreatePost: (content: string, media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[]) => void;
}

export default function Feed({ posts, onLike, onComment, onDelete, onEdit, onCreatePost }: FeedProps) {
    return (
        <div className="w-full">
            <PostCreator onCreatePost={onCreatePost} />

            <div className="space-y-6">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onLike={onLike}
                        onComment={onComment}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </div>
    );
}
