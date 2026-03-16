"use client";

import { useState, useEffect } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { useSkillStore } from "@/context/useSkillStore";

interface TagComponentProps {
  selectedTags: number[]; // Array of skill_ids
  onTagsChange: (tagIds: number[]) => void;
  maxTags?: number;
  placeholder?: string;
  disabled?: boolean;
}

export default function TagComponent({
  selectedTags,
  onTagsChange,
  maxTags = 5,
  placeholder = "Add skills to your post...",
  disabled = false,
}: TagComponentProps) {
  const allSkills = useSkillStore((state) => state.allSkills);
  const fetchAllSkills = useSkillStore((state) => state.fetchAllSkills);
  const isLoadingAllSkills = useSkillStore((state) => state.isLoadingAllSkills);
  const hasFetchedAllSkills = useSkillStore((state) => state.hasFetchedAllSkills);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fire once on mount; the store itself enforces idempotent one-time fetching.
  useEffect(() => {
    useSkillStore.getState().fetchAllSkills();
  }, []);

  // Filter skills based on search and exclude already selected
  const filteredSkills = allSkills.filter(
    (skill) =>
      !selectedTags.includes(skill.skill_id) &&
      skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSkills = allSkills.filter((skill) =>
    selectedTags.includes(skill.skill_id)
  );

  const handleAddTag = (skillId: number) => {
    if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, skillId]);
      setSearchQuery("");
    }
  };

  const handleRemoveTag = (skillId: number) => {
    onTagsChange(selectedTags.filter((id) => id !== skillId));
  };

  const canAddMore = selectedTags.length < maxTags;

  return (
    <div className="w-full">
      {/* Selected Tags Display */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSkills.map((skill) => (
            <div
              key={skill.skill_id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#8387CC]/20 to-[#4169E1]/20 border border-[#8387CC] rounded-full text-sm text-[#34365C] font-medium animate-fadeIn"
            >
              <span>{skill.skill_name}</span>
              <button
                onClick={() => handleRemoveTag(skill.skill_id)}
                disabled={disabled}
                className="ml-1 hover:bg-white/40 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input & Dropdown */}
      {canAddMore && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-left text-sm text-gray-600 hover:border-[#8387CC] transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-[#8387CC]"
          >
            <span className="flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              {placeholder}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full mt-1 w-full bg-white border-2 border-[#8387CC]/30 rounded-lg shadow-lg z-50 animate-slideDown">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#8387CC] text-gray-800"
                  autoFocus
                />
              </div>

              {/* Skills List */}
              <div className="max-h-48 overflow-y-auto">
                {isLoadingAllSkills ? (
                  <div className="p-4 text-center text-gray-500">Loading skills...</div>
                ) : filteredSkills.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {allSkills.length === 0
                      ? "No skills available"
                      : selectedTags.length === 0
                        ? "No skills match your search"
                        : "No more skills to add"}
                  </div>
                ) : (
                  filteredSkills.map((skill) => (
                    <button
                      key={skill.skill_id}
                      onClick={() => handleAddTag(skill.skill_id)}
                      className="w-full text-left px-3 py-2 hover:bg-[#8387CC]/10 transition-colors border-b border-gray-50 last:border-b-0 text-sm text-gray-700 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium text-[#34365C]">{skill.skill_name}</div>
                        {skill.category && (
                          <div className="text-xs text-gray-500">{skill.category}</div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer Message */}
              {selectedTags.length > 0 && (
                <div className="p-2 border-t border-gray-100 text-xs text-gray-500 text-center">
                  {selectedTags.length} of {maxTags} selected
                </div>
              )}
            </div>
          )}

          {/* Close dropdown on click outside */}
          {isOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
          )}
        </div>
      )}

      {/* Max Tags Reached Message */}
      {!canAddMore && (
        <div className="text-xs text-gray-500 mt-2">
          Maximum {maxTags} tags selected
        </div>
      )}
    </div>
  );
}
