"use client";

import { useEffect } from "react";
import PostCreator from "./PostCreator";
import PostCard from "./PostCard";
import { PostEntity } from "@/app/_type/type";
import { usePostStore } from "@/context/usePostStore";
import { useUserStore } from "@/context/useUserStore";

interface FeedProps {
  posts: PostEntity[];
  isLoading?: boolean;
}

export default function Feed({ posts, isLoading = false }: FeedProps) {
  const currentUser = useUserStore((state) => state.currentUser);
  const {
    toggleLike,
    addComment,
    deletePost,
    updatePost,
    fetchComments,
  } = usePostStore((state) => ({
    toggleLike: state.toggleLike,
    addComment: state.addComment,
    deletePost: state.deletePost,
    updatePost: state.updatePost,
    fetchComments: state.fetchComments,
  }));

  // Load comments when posts are displayed
  useEffect(() => {
    posts.forEach((post) => {
      if (post.commentCount > 0) {
        fetchComments(post.id, 1, 5);
      }
    });
  }, [posts, fetchComments]);

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
      <PostCreator />

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Be the first to share!</p>
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
