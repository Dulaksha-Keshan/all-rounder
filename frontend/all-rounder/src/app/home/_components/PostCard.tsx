"use client";

import Image from "next/image";
import { MoreHorizontal, ThumbsUp, MessageCircle, Share2, Trash2, Send, Download } from "lucide-react";
import { useState } from "react";
import { User } from "lucide-react";

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
    currentUserId?: string; // To check ownership
}

export default function PostCard({ post, onLike, onComment, onDelete }: PostCardProps) {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [showOptions, setShowOptions] = useState(false);

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post.id, commentText);
            setCommentText("");
            setShowCommentInput(false);
        }
    };

    return (
        <div className="bg-[var(--white)] rounded-xl border border-[var(--gray-200)] shadow-sm overflow-hidden mb-6">
            {/* Header */}
            <div className="p-4 flex justify-between items-start">
                <div className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--gray-100)] bg-gray-100 flex items-center justify-center">
                        {post.author.image ? (
                            <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
                        ) : (
                            <User className="text-[var(--gray-400)]" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--primary-dark-purple)]">{post.author.name}</h3>
                        <p className="text-xs text-[var(--gray-600)]">{post.author.role}</p>
                        <p className="text-xs text-[var(--gray-400)] mt-0.5">{post.time}</p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="text-[var(--gray-400)] hover:text-[var(--primary-dark-purple)] p-1 rounded-full hover:bg-gray-50"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                    {showOptions && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                            <button
                                onClick={() => { onDelete(post.id); setShowOptions(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                <p className="text-[var(--gray-700)] leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Media */}
            {post.media && post.media.length > 0 && (
                <div className="mb-4 px-4 space-y-2">
                    {post.media.map((item, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-gray-100">
                            {item.type === 'image' ? (
                                <div className="relative w-full h-[400px]">
                                    <Image src={item.url} alt="Post Media" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-white rounded shadow-sm">
                                            <Download size={20} className="text-blue-500" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{item.name}</span>
                                    </div>
                                    <a href={item.url} download className="text-blue-600 hover:underline text-xs">Download</a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="px-4 py-3 border-t border-[var(--gray-100)] flex justify-between text-xs text-[var(--gray-500)]">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
            </div>

            {/* Actions */}
            <div className="px-2 py-2 border-t border-[var(--gray-100)] flex justify-between">
                <button
                    onClick={() => onLike(post.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[var(--gray-50)] font-medium transition-colors ${post.isLiked ? 'text-blue-600' : 'text-[var(--gray-600)]'}`}
                >
                    <ThumbsUp size={18} className={post.isLiked ? 'fill-current' : ''} />
                    <span>Like</span>
                </button>
                <button
                    onClick={() => setShowCommentInput(!showCommentInput)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[var(--gray-50)] text-[var(--gray-600)] font-medium transition-colors"
                >
                    <MessageCircle size={18} />
                    <span>Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[var(--gray-50)] text-[var(--gray-600)] font-medium transition-colors">
                    <Share2 size={18} />
                    <span>Share</span>
                </button>
            </div>

            {/* Comment Input */}
            {showCommentInput && (
                <form onSubmit={handleSubmitComment} className="px-4 py-3 bg-[var(--gray-50)] border-t border-[var(--gray-100)] flex gap-2">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--primary-purple)]"
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
