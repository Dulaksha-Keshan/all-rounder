"use client";

import { useEffect } from "react";
import { useSkillStore } from "@/context/useSkillStore";

interface PostTagsDisplayProps {
  tagIds: number[];
  maxTags?: number;
}

export default function PostTagsDisplay({ tagIds, maxTags = 3 }: PostTagsDisplayProps) {
  const { allSkills, fetchAllSkills, isLoadingAllSkills } = useSkillStore();

  useEffect(() => {
    if (allSkills.length === 0 && !isLoadingAllSkills) {
      fetchAllSkills();
    }
  }, [allSkills.length, isLoadingAllSkills, fetchAllSkills]);

  if (!tagIds || tagIds.length === 0) {
    return null;
  }

  // Map skill IDs to skill names
  const getTags = () => {
    return tagIds.slice(0, maxTags).map(id => {
      const skill = allSkills.find(s => s.skill_id === id);
      return skill ? skill.skill_name : null;
    }).filter(Boolean);
  };

  const tags = getTags();
  const hasMore = tagIds.length > maxTags;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tagName, idx) => (
        <span
          key={idx}
          className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#8387CC]/10 to-[#4169E1]/10 text-[#34365C] border border-[#8387CC]/30"
        >
          {tagName}
        </span>
      ))}
      {hasMore && (
        <span className="px-2.5 py-1 text-xs font-medium text-[#8387CC]">
          +{tagIds.length - maxTags} more
        </span>
      )}
    </div>
  );
}
