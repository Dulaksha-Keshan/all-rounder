"use client";

import { useEffect, useRef } from "react";
import PostCreator from "./PostCreator";
import PostCard from "./PostCard";
import { PostEntity } from "@/app/_type/type";
import { usePostStore } from "@/context/usePostStore";
import { useUserStore } from "@/context/useUserStore";

interface FeedProps {
  posts: PostEntity[];
  isLoading?: boolean;
  showCreator?: boolean;
  emptyMessage?: string;
}

export default function Feed({
  posts,
  isLoading = false,
  showCreator = true,
  emptyMessage = "No posts yet. Be the first to share!",
}: FeedProps) {
  const currentUser = useUserStore((state) => state.currentUser);
  const toggleLike = usePostStore((state) => state.toggleLike);
  const addComment = usePostStore((state) => state.addComment);
  const deletePost = usePostStore((state) => state.deletePost);
  const updatePost = usePostStore((state) => state.updatePost);
  const fetchComments = usePostStore((state) => state.fetchComments);
  const commentsByPostId = usePostStore((state) => state.commentsByPostId);
  const isFetchingCommentsByPostId = usePostStore((state) => state.isFetchingCommentsByPostId);
  const attemptedCommentFetchRef = useRef<Set<string>>(new Set());

  // Load comments once per post to avoid effect-trigger loops from store updates.
  useEffect(() => {
    posts.forEach((post) => {
      if (post.commentCount <= 0) return;

      const key = post.id;
      const hasLoadedComments = Object.prototype.hasOwnProperty.call(commentsByPostId, key);
      const isFetchingComments = isFetchingCommentsByPostId.has(key);
      const hasAttemptedFetch = attemptedCommentFetchRef.current.has(key);

      if (!hasLoadedComments && !isFetchingComments && !hasAttemptedFetch) {
        attemptedCommentFetchRef.current.add(key);
        fetchComments(key, 1, 5);
      }
    });
  }, [posts, fetchComments, commentsByPostId, isFetchingCommentsByPostId]);

  const handleLike = (postId: string) => {
    toggleLike(postId);
  };

  const handleComment = (postId: string, text: string) => {
    addComment(postId, text);
  };

  const handleDelete = async (postId: string) => {
    await deletePost(postId);
  };

  const handleEdit = async (postId: string, formData: FormData) => {
    await updatePost(postId, formData);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {showCreator && <PostCreator />}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <PostCard
              key={post.id || index}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onDelete={handleDelete}
              onEdit={handleEdit}
              currentUserId={currentUser?.uid}
            />
          ))}
        </div>
      )}
    </div>
  );
}
