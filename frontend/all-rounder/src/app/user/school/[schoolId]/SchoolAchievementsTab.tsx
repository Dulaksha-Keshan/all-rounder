
"use client";

import { useEffect } from "react";
import ProfilePostsGallery from "@/app/user/_components/ProfilePostsGallery";
import { usePostStore } from "@/context/usePostStore";

interface SchoolAchievementsTabProps {
  schoolId: string;
}

export default function SchoolAchievementsTab({ schoolId }: SchoolAchievementsTabProps) {
  const fetchSchoolAchievementPosts = usePostStore((state) => state.fetchSchoolAchievementPosts);
  const getSchoolAchievementPosts = usePostStore((state) => state.getSchoolAchievementPosts);
  const isFetchingSchoolAchievementsBySchoolId = usePostStore(
    (state) => state.isFetchingSchoolAchievementsBySchoolId
  );

  useEffect(() => {
    if (!schoolId) return;
    void fetchSchoolAchievementPosts(schoolId, 1, 12);
  }, [schoolId, fetchSchoolAchievementPosts]);

  const posts = getSchoolAchievementPosts(schoolId);
  const isLoading = isFetchingSchoolAchievementsBySchoolId.has(schoolId);

  return (
    <div className="mt-6 surface-readable-strong rounded-xl p-6">
      <div className="mb-5 border-b border-gray-100 pb-3">
        <h2 className="text-xl font-bold text-[#34365C] mb-1">Achievements</h2>
        <p className="text-sm text-gray-500">Recent achievement posts published by this school community.</p>
      </div>

      <ProfilePostsGallery
        posts={posts}
        isLoading={isLoading}
        emptyMessage="No school achievement posts available yet."
      />
    </div>
  );
}

