"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GoBackButton from "@/components/GoBackButton";
import { useUserStore } from "@/context/useUserStore";
import { useSchoolStore } from "@/context/useSchoolStore";

interface TeacherProfilePageProps {
  params: Promise<{
    schoolId: string;
    uid: string;
  }>;
}

export default function TeacherProfilePage({ params }: TeacherProfilePageProps) {
  const { schoolId, uid } = use(params);
  const [isNotFound, setIsNotFound] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const {
    viewedUserProfile: teacher,
    viewedUserRole,
    isFetchingProfile,
    error,
    fetchUserProfileById,
  } = useUserStore();

  const { getSchoolById, fetchSchools, schools } = useSchoolStore();

  useEffect(() => {
    if (schools.length === 0) {
      fetchSchools();
    }
    
    setHasAttemptedFetch(true);
    console.log("Fetching teacher profile for UID:", uid);
    fetchUserProfileById(uid).catch((err: any) => {
      console.error("Profile fetch error:", err);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.response?.data?.message || err.message);
      
      if (err.response?.status === 404) {
        setIsNotFound(true);
      }
    });
  }, [uid, schools.length, fetchSchools, fetchUserProfileById]);

  if (isNotFound) {
    notFound();
  }

  if (isFetchingProfile || !hasAttemptedFetch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[var(--primary-purple)]/20 border-t-[var(--primary-purple)] rounded-full animate-spin mb-4"></div>
          <p className="text-[var(--text-main)] font-semibold">Loading teacher profile...</p>
        </div>
      </div>
    );
  }

  // Show error message if fetch failed
  if (error && !teacher) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] p-4 md:p-8">
        <div className="max-w-4xl mx-auto mt-6">
          <div className="mb-6">
            <GoBackButton variant="solid" />
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 font-semibold mb-2">Error Loading Profile</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <p className="text-gray-600 text-xs">Check the browser console for more details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher || viewedUserRole !== "TEACHER") {
    notFound();
  }

  const school = getSchoolById(schoolId);
  const yearsExperience = teacher.created_at
    ? Math.max(0, new Date().getFullYear() - new Date(teacher.created_at).getFullYear())
    : null;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto mt-6">
        {/* Back Button */}
        <div className="mb-6">
          <GoBackButton variant="solid" />
        </div>

        {/* Profile Header */}
        <div className="bg-[var(--white)] rounded-xl shadow-lg p-8 border border-[var(--gray-200)] mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full -z-10 opacity-50" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 z-10">
            <Image
              src={teacher.profile_picture || "/noAvatar.png"}
              alt={teacher.name}
              width={120}
              height={120}
              className="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary-purple)]/20 shadow-md flex-shrink-0"
            />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-[var(--text-main)] mb-2">
                {teacher.name}
              </h1>
              <p className="text-[var(--text-muted)] font-medium mb-1">{teacher.email}</p>
              <p className="text-sm text-gray-500 mb-4">{school?.name || "Unknown School"}</p>

              {/* Quick Info */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm mb-4">
                {teacher.subject && (
                  <span className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
                    📖 {teacher.subject}
                  </span>
                )}
                {teacher.designation && (
                  <span className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium">
                    👨‍🏫 {teacher.designation}
                  </span>
                )}
                {yearsExperience !== null && yearsExperience > 0 && (
                  <span className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg font-medium">
                    ⏳ {yearsExperience}+ years
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information */}
          <div className="bg-[var(--white)] rounded-xl shadow-sm p-6 border border-[var(--gray-200)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6 border-b pb-3">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
                  Email
                </label>
                <p className="text-[var(--text-main)] font-medium">{teacher.email}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
                  Phone Number
                </label>
                <p className="text-[var(--text-main)] font-medium">
                  {teacher.contact_number ? (
                    <a
                      href={`tel:${teacher.contact_number}`}
                      className="text-[var(--primary-purple)] hover:underline"
                    >
                      {teacher.contact_number}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
                  Date of Birth
                </label>
                <p className="text-[var(--text-main)] font-medium">
                  {teacher.date_of_birth
                    ? new Date(teacher.date_of_birth).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-[var(--white)] rounded-xl shadow-sm p-6 border border-[var(--gray-200)]">
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-6 border-b pb-3">
              Professional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
                  Subject
                </label>
                <p className="text-[var(--text-main)] font-medium">
                  {teacher.subject || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
                  Designation
                </label>
                <p className="text-[var(--text-main)] font-medium">
                  {teacher.designation || "Teacher"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
                  Staff ID
                </label>
                <p className="text-[var(--text-main)] font-medium font-mono text-sm">
                  {teacher.staff_id || "Not assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* School Information */}
        <div className="bg-[var(--white)] rounded-xl shadow-sm p-6 border border-[var(--gray-200)] mb-6">
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 border-b pb-3">
            School Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                School Name
              </label>
              <p className="text-[var(--text-main)] font-medium">{school?.name || "Unknown"}</p>
            </div>
            {teacher.grade && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                  Grade/Class
                </label>
                <p className="text-[var(--text-main)] font-medium">{teacher.grade}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                Unique ID
              </label>
              <p className="text-[var(--text-main)] font-medium font-mono text-sm">{teacher.uid}</p>
            </div>
          </div>
        </div>

        {/* Navigation Link */}
        <div className="bg-[var(--white)] rounded-xl shadow-sm p-6 border border-[var(--gray-200)]">
          <Link
            href={`/dashboard/schools/${schoolId}/teachers`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-blue)] text-[var(--white)] rounded-lg font-medium hover:shadow-lg transition-all"
          >
            ← Back to Teachers List
          </Link>
        </div>
      </div>
    </div>
  );
}
