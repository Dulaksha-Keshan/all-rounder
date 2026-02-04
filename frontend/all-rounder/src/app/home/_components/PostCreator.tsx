"use client";

import { Image as ImageIcon, FileText, Video, Send, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { useHomeStore } from "@/context/useHomeStore";

interface PostCreatorProps {
    onCreatePost: (content: string, media?: { type: 'image' | 'video' | 'doc'; url: string; name: string }[]) => void;
    userImage?: string;
}

export default function PostCreator({ onCreatePost, userImage }: PostCreatorProps) {
    const [content, setContent] = useState("");
    const [media, setMedia] = useState<{ type: 'image' | 'video' | 'doc'; url: string; name: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { saveDraft } = useHomeStore();

    const handlePost = () => {
        if (!content.trim() && media.length === 0) return;
        onCreatePost(content, media);
        setContent("");
        setMedia([]);
    };

    const handleSaveDraft = () => {
        if (!content.trim() && media.length === 0) return;
        saveDraft(content, media);
        setContent("");
        setMedia([]);
        alert("Post saved as draft!");
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'doc';
            setMedia([...media, { type, url, name: file.name }]);
        }
    };

    const removeMedia = (index: number) => {
        setMedia(media.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-[var(--white)] rounded-2xl p-4 shadow-sm border border-[var(--gray-200)] mb-6">
            <div className="flex gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[var(--gray-200)] bg-gray-100">
                    {userImage ? (
                        <Image src={userImage} alt="User" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--primary-purple)] text-white font-bold">
                            You
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="mb-3">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Start a post, share your achievements..."
                            className="w-full bg-[var(--gray-50)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)]/20 resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Media Previews */}
                    {media.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {media.map((item, idx) => (
                                <div key={idx} className="relative group">
                                    {item.type === 'image' ? (
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                            <Image src={item.url} alt="Preview" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 p-2 text-xs text-center break-all">
                                            {item.name}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeMedia(idx)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center px-1">
                        <div className="flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,video/*,application/pdf"
                                onChange={handleFileSelect}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--secondary-pale-lavender)] transition-colors"
                                title="Upload Media"
                            >
                                <ImageIcon size={20} className="text-blue-500" />
                                <span className="hidden sm:inline text-sm font-medium text-[var(--gray-600)]">Media</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--secondary-pale-lavender)] transition-colors">
                                <FileText size={20} className="text-orange-500" />
                                <span className="hidden sm:inline text-sm font-medium text-[var(--gray-600)]">Document</span>
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveDraft}
                                disabled={!content.trim() && media.length === 0}
                                className="px-4 py-2 rounded-lg font-medium text-sm text-[var(--gray-600)] hover:bg-[var(--gray-100)] transition-colors disabled:opacity-50"
                            >
                                Save as Draft
                            </button>
                            <button
                                onClick={handlePost}
                                disabled={!content.trim() && media.length === 0}
                                className="bg-[var(--primary-purple)] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[var(--primary-dark-purple)] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Post</span>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
