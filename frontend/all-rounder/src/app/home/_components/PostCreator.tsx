"use client";

import { Image as ImageIcon, FileText, Send, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { usePostStore } from "@/context/usePostStore";
import { useUserStore } from "@/context/useUserStore";
import RichTextEditor from "./RichTextEditor";
import TagComponent from "@/components/TagComponent";

interface PostCreatorProps {
    userImage?: string;
}

const stripRichText = (value: string) => {
    return value
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
};

export default function PostCreator({ userImage }: PostCreatorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUser = useUserStore((state) => state.currentUser);
    const createDraft = usePostStore((state) => state.createDraft);
    const setCreateDraftField = usePostStore((state) => state.setCreateDraftField);
    const setCreateDraftFiles = usePostStore((state) => state.setCreateDraftFiles);
    const createPost = usePostStore((state) => state.createPost);
    const resetCreateDraft = usePostStore((state) => state.resetCreateDraft);
    const isCreatingPost = usePostStore((state) => state.isCreatingPost);
    const postUploadError = usePostStore((state) => state.postUploadError);

    const { title, content, category, visibility, tags, files } = createDraft;
    const [categoryOpen, setCategoryOpen] = useState(false);
    const normalizedContent = content.trim();
    const isContentEmpty = stripRichText(normalizedContent).length === 0;
    const isNoteCategory = (category as string) === "note";

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNoteCategory) {
            return;
        }

        if (e.target.files) {
            setCreateDraftFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setCreateDraftFiles(newFiles);
    };

    const handlePost = async () => {
        if (isContentEmpty || !category) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", normalizedContent);
        formData.append("category", category);
        formData.append("visibility", visibility);
        formData.append("tags", JSON.stringify(tags));

        if (!isNoteCategory) {
            files.forEach((file) => {
                formData.append("attachments", file);
            });
        }

        const result = await createPost(formData);
        if (result) {
            resetCreateDraft();
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex gap-4">
                {/* User Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
                    {userImage ? (
                        <Image src={userImage} alt="User" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-sm">
                            {currentUser?.name?.charAt(0) || "U"}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    {/* Title Input */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setCreateDraftField("title", e.target.value)}
                        placeholder="Post title..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />

                    {/* Rich Text Editor for Content */}
                    <div className="mb-3">
                        <RichTextEditor
                            value={content}
                            onChange={(val) => setCreateDraftField("content", val)}
                            placeholder="Share your achievements, projects, or thoughts..."
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="mb-3">
                        <div className="relative">
                            <button
                                onClick={() => setCategoryOpen(!categoryOpen)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex justify-between items-center"
                            >
                                <span>{category || "Select category..."}</span>
                                <span className={`transform transition-transform ${categoryOpen ? "rotate-180" : ""}`}>▼</span>
                            </button>
                            {categoryOpen && (
                                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    {["achievement", "participation", "note", "project"].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setCreateDraftField("category", cat);
                                                setCategoryOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-gray-700 text-sm capitalize border-b border-gray-100 last:border-b-0"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="mb-3">
                        <TagComponent
                            selectedTags={tags}
                            onTagsChange={(tagIds) => setCreateDraftField("tags", tagIds)}
                            maxTags={5}
                            placeholder="Add skills to your post..."
                        />
                    </div>

                    {/* File Previews */}
                    {!isNoteCategory && files.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                            {files.map((file, idx) => (
                                <div
                                    key={`${file.name}-${idx}`}
                                    className="relative group flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs"
                                >
                                    <ImageIcon size={14} className="text-blue-500" />
                                    <span className="truncate max-w-[100px]" title={file.name}>
                                        {file.name.substring(0, 20)}
                                    </span>
                                    <button
                                        onClick={() => removeFile(idx)}
                                        className="text-gray-400 hover:text-red-500 ml-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error Message */}
                    {postUploadError && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                            {postUploadError}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,video/*,application/pdf"
                                onChange={handleFileSelect}
                                multiple
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isNoteCategory}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 text-sm"
                                title={isNoteCategory ? "Media is not available for notes" : "Upload Media"}
                            >
                                <ImageIcon size={18} className="text-blue-500" />
                                <span className="hidden sm:inline">Media</span>
                            </button>
                            <button
                                disabled
                                className="flex items-center gap-2 px-3 py-2 rounded-lg opacity-50 cursor-not-allowed text-gray-600 text-sm"
                                title="Document - Coming Soon"
                            >
                                <FileText size={18} className="text-orange-500" />
                                <span className="hidden sm:inline">Docs</span>
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => resetCreateDraft()}
                                disabled={isContentEmpty && files.length === 0}
                                className="px-4 py-2 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handlePost}
                                disabled={isContentEmpty || !category || isCreatingPost}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{isCreatingPost ? "Posting..." : "Post"}</span>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
