"use client";

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { ThumbsUp, MessageCircle, Share2, Trash2, Send, Download, User, MoreHorizontal } from 'lucide-react';
import { useHomeStore } from '@/context/useHomeStore';
import { Post } from '@/app/_type/type';
import gsap from 'gsap';
import ConfirmationModal from "@/components/ConfirmationModal";

export interface PostType {
    id: number;
    author: {
        name: string;
        role: string;
        image?: string;
    };
    time: string;
    content: string;
    likes: number;
    comments: number;
    media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[];
    isLiked?: boolean;
}

interface PostCardProps {
    post: PostType;
    onLike: (id: number) => void;
    onComment: (id: number, text: string) => void;
    onDelete: (id: number) => void;
    currentUserId?: string;
}

export default function PostCard({ post, onLike, onComment, onDelete }: PostCardProps) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post.id, commentText);
            setCommentText("");
            setShowComments(false);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(url).then(() => {
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
            alert("Post link copied to clipboard!");
        });
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
                        {post.author.image ? (
                            <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
                        ) : (
                            <User className="text-[var(--gray-400)]" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--text-main)]">{post.author.name}</h3>
                        <p className="text-xs text-[var(--text-muted)]">{post.author.role}</p>
                        <p className="text-xs text-[var(--gray-400)] mt-0.5">{post.time}</p>
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
                <p className="text-[var(--text-main)] opacity-90 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Media */}
            {post.media && post.media.length > 0 && (
                <div className="mb-4 px-4 space-y-2">
                    {post.media.map((item, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-[var(--gray-200)]">
                            {item.type === 'image' ? (
                                <div className="relative w-full h-[400px]">
                                    <Image src={item.url} alt="Post Media" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="p-4 bg-[var(--gray-50)] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-[var(--white)] rounded shadow-sm">
                                            <Download size={20} className="text-[var(--primary-blue)]" />
                                        </div>
                                        <span className="text-sm font-medium text-[var(--text-main)] truncate max-w-[200px]">{item.name}</span>
                                    </div>
                                    <a href={item.url} download className="text-[var(--primary-blue)] hover:underline text-xs font-bold">Download</a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="px-4 py-3 border-t border-[var(--gray-100)] flex justify-between text-xs text-[var(--text-muted)]">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
            </div>

            {/* Actions */}
            <div className="px-2 py-2 border-t border-[var(--gray-100)] flex justify-between">
                <button
                    onClick={() => onLike(post.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[var(--gray-50)] font-medium transition-colors ${post.isLiked ? 'text-blue-500' : 'text-[var(--text-muted)]'}`}
                >
                    <ThumbsUp size={18} className={post.isLiked ? 'fill-current' : ''} />
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
                onConfirm={() => onDelete(post.id)}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmLabel="Yes, I confirm"
                cancelLabel="No"
                variant="danger"
            />

            {/* Comment Input */}
            {showComments && (
                <form onSubmit={handleCommentSubmit} className="px-4 py-3 bg-[var(--gray-50)] border-t border-[var(--gray-100)] flex gap-2">
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
            )}
        </div>
    );
}
