"use client";

import { useState, use, useEffect, useMemo } from 'react';
import NextImage from 'next/image';
import { notFound } from 'next/navigation';
// import GoBackButton from '@/components/GoBackButton'; // Uncomment if needed
import { useHomeStore } from '@/context/useHomeStore';
import Feed from '@/app/home/_components/Feed';
import { useUserStore } from '@/context/useUserStore';
import { useStudentStore } from '@/context/useStudentStore';
import { usePostStore } from '@/context/usePostStore';
import { useSchoolStore } from '@/context/useSchoolStore';
import { useSkillStore } from '@/context/useSkillStore';
// import { useEventStore } from '@/context/useEventStore';
import PostCard from '@/app/home/_components/PostCard';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PostEntity } from '@/app/_type/type';

interface StudentProfileProps {
  params: Promise<{ id: string; }>;
}

export default function StudentProfile({ params }: StudentProfileProps) {
  const { id } = use(params);

  // --- STORES ---
  const { currentUser, userRole, updateProfile, followers, following, followRequests, sentRequests, followUser, unfollowUser, sendFollowRequest, cancelFollowRequest } = useUserStore();
  const { getStudentById } = useStudentStore();
  const { getSchoolById, schools, fetchSchools } = useSchoolStore();
  const { drafts, deleteDraft } = useHomeStore();
  const postsById = usePostStore((state) => state.postsById);
  const myPostIds = usePostStore((state) => state.myPostIds);
  const fetchMyPosts = usePostStore((state) => state.fetchMyPosts);
  const fetchUserPosts = usePostStore((state) => state.fetchUserPosts);
  const userPostIds = usePostStore((state) => state.userPostIdsByKey[id] ?? []);
  const isFetchingPosts = usePostStore((state) => state.isFetchingPosts);
  const allSkills = useSkillStore((state) => state.allSkills);
  const fetchAllSkills = useSkillStore((state) => state.fetchAllSkills);
  const hasFetchedAllSkills = useSkillStore((state) => state.hasFetchedAllSkills);
  const isLoadingAllSkills = useSkillStore((state) => state.isLoadingAllSkills);

  // --- PROFILE LOGIC ---
  // 1. Determine if the logged-in user is viewing their own profile
  const isOwnProfile = currentUser?.uid === id && userRole === 'STUDENT';

  // 2. Determine the source of truth for the data
  // If it's my profile, use my live store data. Otherwise, get the public data from the student store.
  const viewedStudent = isOwnProfile ? currentUser : getStudentById(id);

  // Fetch schools if they aren't loaded yet to resolve the school name
  useEffect(() => {
    if (schools.length === 0) fetchSchools();
  }, [schools.length, fetchSchools]);

  useEffect(() => {
    if (isOwnProfile) {
      fetchMyPosts();
      return;
    }

    fetchUserPosts(id);
  }, [id, isOwnProfile, fetchMyPosts, fetchUserPosts]);

  // --- LOCAL STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  // --- HELPERS ---
  const skillNameById = useMemo(() => {
    return new Map(allSkills.map((skill) => [skill.skill_id, skill.skill_name]));
  }, [allSkills]);

  const resolveSkillLabel = (skill: any) => {
    if (skill && typeof skill === 'object') {
      if (typeof skill.skill_name === 'string' && skill.skill_name.trim()) return skill.skill_name;
      if (typeof skill.name === 'string' && skill.name.trim()) return skill.name;

      const rawId = skill.skill_id ?? skill.id ?? skill.value;
      if (rawId !== undefined && rawId !== null) {
        return skillNameById.get(Number(rawId)) || String(rawId);
      }
    }

    const numericId = Number(skill);
    if (!Number.isNaN(numericId)) {
      return skillNameById.get(numericId) || String(skill);
    }

    return String(skill ?? '');
  };

  const profilePosts = useMemo(() => {
    const profilePostIds = isOwnProfile ? myPostIds : userPostIds;
    return profilePostIds
      .map((postId) => postsById[postId])
      .filter((post): post is PostEntity => Boolean(post));
  }, [isOwnProfile, myPostIds, userPostIds, postsById]);

  const normalizeDraftToPostEntity = (draft: any): PostEntity => ({
    id: draft._id || draft.id || '',
    title: draft.title || '',
    content: draft.content || '',
    category: draft.category || draft.postType || '',
    visibility: draft.visibility || 'public',
    attachments: draft.attachments || [],
    tags: draft.tags || [],
    likeCount: draft.likeCount ?? draft.likes?.count ?? 0,
    commentCount: draft.commentCount ?? draft.comments ?? 0,
    createdAt: draft.createdAt || new Date().toISOString(),
    updatedAt: draft.updatedAt,
    authorId: draft.authorId || draft.author?.id,
    authorName: draft.authorName || draft.author?.name,
    authorType: draft.authorType,
  });

  // Keep edit form in sync with the viewed student (crucial for after saving)
  useEffect(() => {
    if (viewedStudent) {
      setEditData({ ...viewedStudent });
    }
  }, [viewedStudent]);

  useEffect(() => {
    const shouldLoadSkillDictionary = Array.isArray(viewedStudent?.skills)
      && viewedStudent.skills.some((skill: any) => {
        if (skill && typeof skill === 'object') {
          return !skill.name && !skill.skill_name;
        }

        return typeof skill === 'number' || /^\d+$/.test(String(skill));
      });

    if (
      shouldLoadSkillDictionary &&
      allSkills.length === 0 &&
      !hasFetchedAllSkills &&
      !isLoadingAllSkills
    ) {
      fetchAllSkills();
    }
  }, [viewedStudent?.skills, allSkills.length, hasFetchedAllSkills, isLoadingAllSkills, fetchAllSkills]);

  if (!viewedStudent) {
    notFound(); // Triggers Next.js 404 page if user doesn't exist
  }

  // --- HELPERS ---
  const school = getSchoolById(viewedStudent.school_id || viewedStudent.schoolId);
  const schoolName = school?.name || 'Unknown School';

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateAge = (dob: string | undefined) => {
    if (!dob) return 'N/A';
    const birthday = new Date(dob);
    const ageDifMs = Date.now() - birthday.getTime();
    return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
  };

  const registeredEventsWithDetails: any[] = []; // Placeholder until event logic is added

  // --- ACTIONS ---
  const handleSave = async () => {
    if (isOwnProfile) {
      try {
        await updateProfile(editData);
        setIsEditing(false);
        alert('Changes saved successfully!');
      } catch (error) {
        alert("Failed to save changes. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setEditData({ ...viewedStudent });
    setIsEditing(false);
  };

  const isFollowing = following.includes(viewedStudent.uid);
  const isRequested = sentRequests.includes(viewedStudent.uid);
  // Calculate dynamic follower/following counts
  const followersCount = isOwnProfile ? followers.length : (viewedStudent.followers?.length || 0);
  const followingCount = isOwnProfile ? following.length : (viewedStudent.following?.length || 0);
  
  const handleFollowAction = () => {
    if (isFollowing) {
      unfollowUser(viewedStudent.uid);
    } else if (isRequested) {
      cancelFollowRequest(viewedStudent.uid);
    } else {
      followUser(viewedStudent.uid);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto mt-20"> {/* Added mt-20 to clear fixed navbar */}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-[#DCD0FF]/50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full -z-10 opacity-50" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
              {viewedStudent.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-[#34365C] mb-2">
                {viewedStudent.name}
              </h1>
              <p className="text-gray-600 mb-1">{viewedStudent.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span>{schoolName}</span>
                <span className="hidden md:inline">•</span>
                <span>Age: {calculateAge(viewedStudent.date_of_birth)}</span>
              </div>

              {/* Social Stats */}
              <div className="flex justify-center md:justify-start items-center gap-6 text-sm font-medium mt-4 bg-gray-50 p-3 rounded-lg inline-flex">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl text-[#8387CC]">{followersCount}</span>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Followers</span>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl text-[#8387CC]">{followingCount}</span>
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Following</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 md:mt-0 flex gap-3 w-full md:w-auto justify-center">
              {isOwnProfile ? (
                !isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#8387CC] to-[#6B73C8] text-white rounded-lg hover:shadow-lg transition-all font-bold w-full md:w-auto"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={handleSave}
                      className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 md:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )
              ) : (
                <button
                  onClick={handleFollowAction}
                  className={`px-8 py-2.5 rounded-lg font-bold transition-all w-full md:w-auto ${isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 shadow-sm'
                    : isRequested
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                >
                  {isFollowing ? 'Unfollow' : isRequested ? 'Requested' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6 border border-[#DCD0FF]/50 overflow-x-auto hide-scrollbar">
          <div className="flex w-max min-w-full border-b border-gray-100">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'overview'
                ? 'border-b-2 border-[#4169E1] text-[#4169E1] bg-blue-50/50'
                : 'text-gray-500 hover:text-[#34365C] hover:bg-gray-50'
                }`}
            >
              Overview
            </button>

            {isOwnProfile && (
              <>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'personal'
                    ? 'border-b-2 border-[#4169E1] text-[#4169E1] bg-blue-50/50'
                    : 'text-gray-500 hover:text-[#34365C] hover:bg-gray-50'
                    }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'activities'
                    ? 'border-b-2 border-[#4169E1] text-[#4169E1] bg-blue-50/50'
                    : 'text-gray-500 hover:text-[#34365C] hover:bg-gray-50'
                    }`}
                >
                  History
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'skills'
                    ? 'border-b-2 border-[#4169E1] text-[#4169E1] bg-blue-50/50'
                    : 'text-gray-500 hover:text-[#34365C] hover:bg-gray-50'
                    }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'drafts'
                    ? 'border-b-2 border-[#4169E1] text-[#4169E1] bg-blue-50/50'
                    : 'text-gray-500 hover:text-[#34365C] hover:bg-gray-50'
                    }`}
                >
                  My Drafts
                </button>
              </>
            )}
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Events Joined</p>
                <p className="text-3xl font-black text-[#34365C]">0</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">School</p>
                <p className="text-lg font-bold text-[#8387CC] truncate px-2">{schoolName}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Grade</p>
                <p className="text-3xl font-black text-[#34365C]">{viewedStudent.grade || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</p>
                <p className="text-3xl font-black text-[#8387CC]">{viewedStudent.skills?.length || 0}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* About Section */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-[#34365C] mb-4 border-b pb-2">About Me</h2>
                {viewedStudent.about ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{viewedStudent.about}</p>
                ) : (
                  <p className="text-gray-400 italic">This user hasn't written a bio yet.</p>
                )}
              </div>

              {/* Skills Display */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-[#34365C] mb-4 border-b pb-2">Top Skills</h2>
                {viewedStudent.skills && viewedStudent.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {viewedStudent.skills.map((skill: any, index: number) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
                        {resolveSkillLabel(skill)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-sm">No skills listed.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="mb-5 border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-[#34365C]">Posts</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {isOwnProfile ? 'Your recent posts and shared updates.' : `${viewedStudent.name}'s recent posts and shared updates.`}
                </p>
              </div>

              <Feed
                posts={profilePosts}
                isLoading={isFetchingPosts}
                showCreator={false}
                emptyMessage={isOwnProfile ? "You haven't posted anything yet." : "No posts published yet."}
              />
            </div>
          </div>
        )}

        {/* PERSONAL INFO TAB (SETTINGS) */}
        {activeTab === 'personal' && isOwnProfile && (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-[#34365C]">Account Settings</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-[#4169E1] hover:underline">Edit Info</button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                {isEditing ? (
                  <input type="text" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8387CC] outline-none" />
                ) : (
                  <p className="text-[#34365C] font-medium text-lg">{viewedStudent.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <p className="text-gray-600 font-medium text-lg bg-gray-50 px-3 py-1 rounded border border-transparent inline-block">{viewedStudent.email}</p>
                {isEditing && <p className="text-xs text-orange-500 mt-1">Email cannot be changed.</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date of Birth</label>
                {isEditing ? (
                  <input type="date" value={editData.date_of_birth ? new Date(editData.date_of_birth).toISOString().split('T')[0] : ''} onChange={(e) => setEditData({ ...editData, date_of_birth: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8387CC] outline-none" />
                ) : (
                  <p className="text-[#34365C] font-medium text-lg">{formatDate(viewedStudent.date_of_birth)}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                {isEditing ? (
                  <input type="tel" value={editData.contact_number || ''} onChange={(e) => setEditData({ ...editData, contact_number: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8387CC] outline-none" />
                ) : (
                  <p className="text-[#34365C] font-medium text-lg">{viewedStudent.contact_number || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Grade / Class</label>
                {isEditing ? (
                  <input type="text" value={editData.grade || ''} onChange={(e) => setEditData({ ...editData, grade: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8387CC] outline-none" />
                ) : (
                  <p className="text-[#34365C] font-medium text-lg">Grade {viewedStudent.grade || 'N/A'}</p>
                )}
              </div>

              <div className="md:col-span-2 mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio / About Me</label>
                {isEditing ? (
                  <textarea value={editData.about || ''} onChange={(e) => setEditData({ ...editData, about: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8387CC] outline-none resize-y" rows={4} placeholder="Write something about yourself..." />
                ) : (
                  <p className="text-[#34365C] font-medium">{viewedStudent.about || 'N/A'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={handleCancel} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2.5 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white rounded-lg shadow hover:shadow-lg transition-all font-medium">Save Changes</button>
              </div>
            )}
          </div>
        )}

        {/* ACTIVITIES TAB */}
        {activeTab === 'activities' && isOwnProfile && (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 animate-fadeIn">
            <h2 className="text-xl font-bold text-[#34365C] mb-6 border-b pb-4">Event History</h2>
            {registeredEventsWithDetails.length > 0 ? (
              <div className="space-y-4">
                {/* Event mapping logic remains unchanged */}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4 text-2xl">📅</div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">No Events Yet</h3>
                <p className="text-gray-500 text-sm">You haven't registered for any events.</p>
              </div>
            )}
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && isOwnProfile && (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-[#34365C]">My Skills & Talents</h2>
              <button className="text-sm font-semibold text-[#4169E1] hover:underline">+ Add Skill</button>
            </div>
            {viewedStudent.skills && viewedStudent.skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {viewedStudent.skills.map((skill: any, index: number) => (
                  <div key={index} className="px-5 py-2.5 bg-white border-2 border-[#DCD0FF] text-[#34365C] rounded-lg text-sm font-bold shadow-sm hover:border-[#8387CC] transition-colors cursor-default">
                    {resolveSkillLabel(skill)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mb-4 text-2xl">⭐</div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">No Skills Added</h3>
                <p className="text-gray-500 text-sm">Add your skills to stand out on the platform!</p>
              </div>
            )}
          </div>
        )}

        {/* DRAFTS TAB */}
        {activeTab === 'drafts' && isOwnProfile && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-[#34365C] mb-4 pl-2">Saved Drafts</h2>
            {drafts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drafts.map((draft) => (
                  <PostCard
                    key={draft._id || draft.id}
                    post={normalizeDraftToPostEntity(draft)}
                    onLike={() => { }}
                    onComment={() => { }}
                    onDelete={(id) => {
                      setDraftToDelete(id);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-16 border border-gray-100 text-center">
                <p className="text-gray-500 font-medium">You don't have any saved drafts yet.</p>
              </div>
            )}
          </div>
        )}

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => draftToDelete && deleteDraft(draftToDelete)}
          title="Delete Draft"
          message="Are you sure you want to delete this draft? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
        />
      </div>
    </div>
  );
}