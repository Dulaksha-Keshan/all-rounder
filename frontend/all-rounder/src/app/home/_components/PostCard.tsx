"use client";

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { ThumbsUp, MessageCircle, Share2, Trash2, Send, User, MoreHorizontal, Edit2 } from 'lucide-react';
import gsap from 'gsap';
import ConfirmationModal from "@/components/ConfirmationModal";
import { PostEntity, CommentEntity } from '@/app/_type/type';
import { usePostStore } from '@/context/usePostStore';
import { useUserStore } from '@/context/useUserStore';

interface PostCardProps {
  post: PostEntity;
  onLike: (postId: string) => void;
  onComment?: (postId: string, text: string) => void;
  onDelete: (postId: string) => void;
  onEdit?: (postId: string, data: FormData) => void;
  currentUserId?: string;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onDelete,
  onEdit,
  currentUserId,
}: PostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const currentUser = useUserStore((state) => state.currentUser);
  const { getCommentsByPostId, isFetchingCommentsByPostId, pendingCommentDeleteById } =
    usePostStore((state) => ({
      getCommentsByPostId: state.getCommentsByPostId,
      isFetchingCommentsByPostId: state.isFetchingCommentsByPostId,
      pendingCommentDeleteById: state.pendingCommentDeleteById,
    }));

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState({ title: "", content: "" });

  const comments = getCommentsByPostId(post.id);
  const isDeletingPost = post.id;

  // Animate card on mount
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  const handleShare = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    });
  };

  const handleEditSave = () => {
    if (onEdit && edits.content.trim()) {
      const formData = new FormData();
      formData.append('title', edits.title);
      formData.append('content', edits.content);
      onEdit(post.id, formData);
      setIsEditing(false);
    }
  };

  const handleEditStart = () => {
    setEdits({ title: post.title, content: post.content });
    setIsEditing(true);
    setShowOptions(false);
  };

  const isOwnPost = currentUser?.uid === post.authorId;

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 transition-colors duration-300"
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
            <User className="text-gray-400" size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 truncate">Author ID: {post.authorId}</h3>
            <p className="text-xs text-gray-600 truncate">{post.category}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-50 transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>
            {showOptions && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                {onEdit && (
                  <button
                    onClick={handleEditStart}
                    className="w-full px-4 py-2 text-left text-sm text-blue-500 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={edits.title}
              onChange={(e) => setEdits({ ...edits, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              placeholder="Post title..."
            />
            <textarea
              value={edits.content}
              onChange={(e) => setEdits({ ...edits, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 min-h-[100px] resize-y"
              placeholder="Edit your post..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={!edits.content.trim()}
                className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            {post.title && <h2 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h2>}
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Media - R2 Links */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="mb-4 px-4 space-y-2">
          {post.attachments.map((url, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <div className="relative w-full h-[300px]">
                <Image
                  src={url}
                  alt="Post attachment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 640px"
                  priority={idx === 0}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between text-sm text-gray-600">
        <span>{post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}</span>
        <span>{post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}</span>
      </div>

      {/* Actions */}
      <div className="px-2 py-2 border-t border-gray-100 flex justify-between gap-1">
        <button
          onClick={() => onLike(post.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors"
        >
          <ThumbsUp size={18} />
          <span>Like</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors"
        >
          <MessageCircle size={18} />
          <span>Comment</span>
        </button>
        <button
          onClick={handleShare}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors ${
            isShared ? 'text-green-600' : 'text-gray-600'
          }`}
        >
          <Share2 size={18} />
          <span>{isShared ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-gray-50 border-t border-gray-100">
          {/* Comment List */}
          {comments && comments.length > 0 && (
            <div className="px-4 py-3 space-y-4 max-h-[300px] overflow-y-auto">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`flex gap-3 transition-opacity ${
                    pendingCommentDeleteById.has(comment.id) ? 'opacity-50' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {comment.userId.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                      <p className="text-xs font-bold text-gray-900">User: {comment.userId}</p>
                      <p className="text-sm text-gray-700 mt-1 break-words">{comment.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleCommentSubmit} className="px-4 py-3 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(post.id)}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}

