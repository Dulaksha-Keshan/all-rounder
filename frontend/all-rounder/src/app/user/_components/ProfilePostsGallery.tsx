"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import PostCard from '@/app/home/_components/PostCard';
import { PostEntity } from '@/app/_type/type';
import { usePostStore } from '@/context/usePostStore';
import { useUserStore } from '@/context/useUserStore';

interface ProfilePostsGalleryProps {
  posts: PostEntity[];
  isLoading?: boolean;
  emptyMessage: string;
}

export default function ProfilePostsGallery({
  posts,
  isLoading = false,
  emptyMessage,
}: ProfilePostsGalleryProps) {
  const currentUser = useUserStore((state) => state.currentUser);
  const toggleLike = usePostStore((state) => state.toggleLike);
  const addComment = usePostStore((state) => state.addComment);
  const deletePost = usePostStore((state) => state.deletePost);
  const updatePost = usePostStore((state) => state.updatePost);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [posts, selectedPostId]
  );

  const currentUserId = useMemo(() => {
    if (!currentUser) return undefined;
    if ('uid' in currentUser) return currentUser.uid;
    if ('organization_id' in currentUser) return currentUser.organization_id;
    return undefined;
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <p className="text-sm font-medium text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => {
          const hasAttachment = post.attachments.length > 0;
          const previewImage = hasAttachment ? post.attachments[0] : null;

          return (
            <button
              key={post.id}
              type="button"
              onClick={() => setSelectedPostId(post.id)}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              {previewImage ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={previewImage}
                    alt={post.title || 'Post preview'}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4">
                    <h3 className="line-clamp-2 text-base font-semibold text-white">
                      {post.title || 'Untitled Post'}
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-40 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-8">
                  <h3 className="text-center text-lg font-semibold text-gray-900">
                    {post.title || 'Untitled Post'}
                  </h3>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
          <div className="relative max-h-full w-full max-w-3xl overflow-y-auto rounded-3xl">
            <button
              type="button"
              onClick={() => setSelectedPostId(null)}
              className="sticky top-4 z-10 ml-auto mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-md transition-colors hover:text-gray-900"
              aria-label="Close post preview"
            >
              <X size={20} />
            </button>

            <PostCard
              post={selectedPost}
              onLike={(postId) => void toggleLike(postId)}
              onComment={(postId, text) => void addComment(postId, text)}
              onDelete={(postId) => {
                void deletePost(postId);
                setSelectedPostId((currentId) => (currentId === postId ? null : currentId));
              }}
              onEdit={(postId, formData) => void updatePost(postId, formData)}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      )}
    </>
  );
}