"use client";

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { ThumbsUp, MessageCircle, Share2, Trash2, Send, Download, User, MoreHorizontal, Edit2 } from 'lucide-react';
import { useHomeStore } from '@/context/useHomeStore';
import gsap from 'gsap';
import ConfirmationModal from "@/components/ConfirmationModal";

import { Post, Comment, Like } from '@/app/_type/type';

// Remove local interfaces that conflict with global ones
// Use the global Post type directly


interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onComment: (id: string, text: string) => void;
    onDelete: (id: string) => void;
    onEdit?: (id: string, newContent: string) => void;
    currentUserId?: string;
}

export default function PostCard({ post, onLike, onComment, onDelete, onEdit, currentUserId }: PostCardProps) {
    const [showComments, setShowComments] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const cardRef = useRef<HTMLDivElement>(null);

    // Helper function to strip HTML tags
    const stripHtml = (html: string): string => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    // Helper function to convert plain text to HTML (preserving line breaks)
    const textToHtml = (text: string): string => {
        return text.replace(/\n/g, '<br>');
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post._id, commentText);
            setCommentText("");
            setShowComments(false);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/post/${post._id}`;
        navigator.clipboard.writeText(url).then(() => {
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
            alert("Post link copied to clipboard!");
        });
    };

    const handleEditSave = () => {
        if (onEdit && editContent.trim()) {
            if (onEdit && editContent.trim()) {
                const htmlContent = textToHtml(editContent);
                onEdit(post._id, htmlContent);
                setIsEditing(false);
            }
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

    const handleEditStart = () => {
        setEditContent(stripHtml(post.content));
        setIsEditing(true);
        setShowOptions(false);
    };

    useEffect(() => {
        if (!cardRef.current) return;
        gsap.fromTo(cardRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        );
    }, []);

    return (
        <div ref={cardRef} className="bg-[var(--white)] rounded-xl border border-[var(--gray-200)] shadow-sm overflow-hidden mb-6 transition-colors duration-300 opacity-0">
            {/* Header */}
            <div className="p-4 flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--gray-100)] bg-[var(--gray-50)] flex items-center justify-center">
                        {post.author?.image ? (
                            <Image src={post.author.image} alt={post.author.name || 'User'} fill className="object-cover" />
                        ) : (
                            <User className="text-[var(--gray-400)]" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--text-main)]">{post.author?.name || 'Unknown User'}</h3>
                        <p className="text-xs text-[var(--text-muted)]">{post.author?.role || 'User'}</p>
                        <p className="text-xs text-[var(--gray-400)] mt-0.5">{post.time || new Date(post.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="text-[var(--gray-400)] hover:text-[var(--primary-purple)] p-1 rounded-full hover:bg-[var(--gray-50)] transition-colors"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                    {showOptions && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-[var(--white)] rounded-lg shadow-lg border border-[var(--gray-200)] z-10 py-1">
                            {onEdit && (
                                <button
                                    onClick={handleEditStart}
                                    className="w-full px-4 py-2 text-left text-sm text-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/10 flex items-center gap-2 transition-colors"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                            )}
                            <button
                                onClick={() => { setIsDeleteModalOpen(true); setShowOptions(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 border border-[var(--gray-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-[var(--white)] text-[var(--text-main)] min-h-[100px] resize-y"
                            placeholder="Edit your post..."
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={handleEditCancel}
                                className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--gray-50)] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                disabled={!editContent.trim()}
                                className="px-4 py-2 text-sm font-medium bg-[var(--primary-blue)] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="text-[var(--text-main)] opacity-90 leading-relaxed rich-text-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                )}
            </div>

            {/* Media */}
            {post.attachments && post.attachments.length > 0 && (
                <div className="mb-4 px-4 space-y-2">
                    {post.attachments.map((url, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-[var(--gray-200)]">
                            {/* Simplified media handling - assuming images for now based on string[] in Post type. 
                                 Real implementation might need to check file extension or metadata. */}
                            <div className="relative w-full h-[400px]">
                                <Image src={url} alt="Post Media" fill className="object-cover" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Legacy Media Handling (if keeping existing prop structure for compatibility) */}
            {/* Note: The global Post type uses 'attachments: string[]'. The old local type used 'media: {...}[]'. 
                 I've added the attachments block above. if 'media' is still passed (which isn't on Post type), it won't be accessible.
                 Removing the old media block to avoid confusion if we are strictly using 'Post'. 
                 If we need to support both, we should cast or extend the type. 
                 Proceeding with 'attachments' as defined in type.ts.
              */}

            {/* Stats */}
            <div className="px-4 py-3 border-t border-[var(--gray-100)] flex justify-between text-xs text-[var(--text-muted)]">
                <button
                    onClick={() => setShowLikesModal(true)}
                    className="hover:underline"
                >
                    {post.likes.length} likes
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="hover:underline"
                >
                    {post.comments.length} comments
                </button>
            </div>

            {/* Actions */}
            <div className="px-2 py-2 border-t border-[var(--gray-100)] flex justify-between">
                <button
                    onClick={() => onLike(post._id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[var(--gray-50)] font-medium transition-colors ${post.likes.includes(currentUserId || '') ? 'text-blue-500' : 'text-[var(--text-muted)]'}`}
                >
                    <ThumbsUp size={18} className={post.likes.includes(currentUserId || '') ? 'fill-current' : ''} />
                    <span>Like</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[var(--gray-50)] text-[var(--text-muted)] font-medium transition-colors"
                >
                    <MessageCircle size={18} />
                    <span>Comment</span>
                </button>
                <button
                    onClick={handleShare}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[var(--gray-50)] font-medium transition-colors ${isShared ? 'text-green-500' : 'text-[var(--text-muted)]'}`}
                >
                    <Share2 size={18} />
                    <span>{isShared ? 'Copied' : 'Share'}</span>
                </button>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => onDelete(post._id)}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmLabel="Yes, I confirm"
                cancelLabel="No"
                variant="danger"
            />

            {/* Likes Modal */}
            {showLikesModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--card-bg)] text-[var(--text-main)] rounded-xl max-w-sm w-full p-4 overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold text-lg">Likes</h3>
                            <button onClick={() => setShowLikesModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                <span className="sr-only">Close</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-3">
                            {post.likes.length > 0 ? (
                                post.likes.map((likeId, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {/* Since we only have IDs in the new Post type, we can't show names easily without fetching.
                                                 Displaying a placeholder or just the ID for now, or we'd need to fetch user details. */}
                                            U
                                        </div>
                                        <span className="font-medium text-sm">User {likeId}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No likes yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Comments Section */}
            {showComments && (
                <div className="bg-[var(--gray-50)] border-t border-[var(--gray-100)]">
                    {/* Comment List */}
                    {post.comments.length > 0 && (
                        <div className="px-4 py-3 space-y-4 max-h-[300px] overflow-y-auto">
                            {post.comments.map((comment) => (
                                <div key={comment._id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center text-purple-600 font-bold text-xs">
                                        {comment.user?.image ? (
                                            <Image src={comment.user.image} alt={comment.user.name} width={32} height={32} className="rounded-full" />
                                        ) : (
                                            (comment.user?.name || '?').charAt(0)
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--gray-200)] shadow-sm">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="font-bold text-xs">{comment.user?.name || 'Unknown'}</span>
                                                <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-[var(--text-main)] opacity-90">{comment.content}</p>
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
                            className="flex-1 px-3 py-2 rounded-lg border border-[var(--gray-200)] bg-[var(--white)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary-purple)]"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="p-2 bg-[var(--primary-purple)] text-white rounded-lg disabled:opacity-50"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
