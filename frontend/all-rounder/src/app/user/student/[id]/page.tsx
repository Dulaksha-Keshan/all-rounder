"use client";

import { useState, use } from 'react';
import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import GoBackButton from '@/components/GoBackButton';
import { useHomeStore } from '@/context/useHomeStore';
import { useUserStore } from '@/context/useUserStore';
import { useStudentStore } from '@/context/useStudentStore';
import { useSchoolStore } from '@/context/useSchoolStore';
import { useEventStore } from '@/context/useEventStore';
import PostCard from '@/app/home/_components/PostCard';
import ConfirmationModal from '@/components/ConfirmationModal';

interface StudentProfileProps {
  params: Promise<{ id: string; }>;
}

export default function StudentProfile({ params }: StudentProfileProps) {
  const { id } = use(params);

  // Helper function for consistent date formatting
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Get data from stores
  const { getStudentById } = useStudentStore();
  const { getSchoolById } = useSchoolStore();
  const { getEventById } = useEventStore();

  // Find the student by ID - ID is now a string from the URL
  const student = getStudentById(id);

  if (!student) {
    notFound();
  }

  // Get school name
  const school = getSchoolById(student.schoolId);
  const schoolName = school?.name || 'Unknown School';

  // TODO: Get this from your auth system
  const loggedInUserId = "1"; // Replace with actual auth
  const loggedInUserType = "student"; // Replace with actual auth

  // Check if viewing own profile
  // Check if viewing own profile
  const isOwnProfile = loggedInUserId === student.id && loggedInUserType === "student";

  const { currentUser, updateProfile } = useUserStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Use persistent currentUser if it's the logged-in user, otherwise use static data
  const initialData = (isOwnProfile && currentUser) ? (currentUser as typeof student) : student;
  const [studentData, setStudentData] = useState(initialData);
  const [editData, setEditData] = useState({ ...initialData });

  // Sync effect: invalidates local state if store updates elsewhere (optional but good)
  // useEffect(() => {
  //   if (isOwnProfile && currentUser) {
  //      setStudentData(currentUser as typeof student);
  //   }
  // }, [currentUser, isOwnProfile]);


  const { drafts, deleteDraft, likePost, commentPost } = useHomeStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<number | null>(null);

  // Get full event details for registered events
  const registeredEventsWithDetails = studentData.registeredEvents?.map(reg => {
    const event = getEventById(reg.eventId); // No Number() conversion needed
    return {
      ...reg,
      eventDetails: event
    };
  }) || [];

  const handleSave = () => {
    if (isOwnProfile) {
      // Persist to store
      updateProfile(editData);
      // Local update for immediate feedback
      setStudentData(editData);
    }
    setIsEditing(false);
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    setEditData({ ...studentData });
    setIsEditing(false);
  };

  const {
    following,
    followRequests,
    sentRequests,
    followUser,
    unfollowUser,
    sendFollowRequest,
    cancelFollowRequest
  } = useUserStore();

  const isFollowing = following.includes(student.id);
  const isRequested = sentRequests.includes(student.id);

  const handleFollowAction = () => {
    if (isFollowing) {
      unfollowUser(student.id);
    } else if (isRequested) {
      cancelFollowRequest(student.id);
    } else {
      // For now, assume public profiles for simplicity, or toggle based on logic
      followUser(student.id);
      // If private: sendFollowRequest(student.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#E5DEFF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* <GoBackButton /> */}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-[#DCD0FF]/50">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {studentData.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#34365C] mb-2">
                {studentData.name}
              </h1>
              <p className="text-gray-600 mb-1">{studentData.email}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span>{schoolName}</span>
                <span>•</span>
                <span>Age {studentData.age}</span>
              </div>

              {/* Social Stats */}
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="text-[var(--text-main)]">
                  <span className="font-bold text-[var(--primary-purple)]">120</span> Followers
                </div>
                <div className="text-[var(--text-main)]">
                  <span className="font-bold text-[var(--primary-purple)]">45</span> Following
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isOwnProfile ? (
                !isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[var(--primary-blue)] text-white rounded-lg hover:shadow-lg transition-all font-bold"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )
              ) : (
                <button
                  onClick={handleFollowAction}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                    : isRequested
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-[var(--primary-blue)] text-white hover:shadow-lg'
                    }`}
                >
                  {isFollowing ? 'Unfollow' : isRequested ? 'Requested' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-[#DCD0FF]/50 overflow-x-auto">
          <div className="flex">
            {/* Overview tab - always visible */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-bold whitespace-nowrap transition-colors ${activeTab === 'overview'
                ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-[var(--primary-blue)]/5'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--white)]/50'
                }`}
            >
              Overview
            </button>

            {/* Private tabs - only show if viewing own profile */}
            {isOwnProfile && (
              <>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === 'personal'
                    ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                    : 'text-gray-600 hover:text-[#34365C]'
                    }`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === 'activities'
                    ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                    : 'text-gray-600 hover:text-[#34365C]'
                    }`}
                >
                  My Activities
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === 'skills'
                    ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                    : 'text-gray-600 hover:text-[#34365C]'
                    }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`px-6 py-3 font-bold whitespace-nowrap transition-colors ${activeTab === 'drafts'
                    ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-[var(--primary-blue)]/5'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--white)]/50'
                    }`}
                >
                  My Drafts
                </button>
              </>
            )}
          </div>
        </div>

        {/* OVERVIEW TAB - PUBLIC */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50 text-center">
                <p className="text-sm text-gray-600 mb-1">Events Registered</p>
                <p className="text-3xl font-bold text-[#8387CC]">
                  {studentData.registeredEvents?.length || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50 text-center">
                <p className="text-sm text-gray-600 mb-1">School</p>
                <p className="text-xl font-bold text-[#34365C]">{schoolName}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50 text-center">
                <p className="text-sm text-gray-600 mb-1">Age</p>
                <p className="text-3xl font-bold text-[#8387CC]">{studentData.age}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50 text-center">
                <p className="text-sm text-gray-600 mb-1">Skills</p>
                <p className="text-3xl font-bold text-[#8387CC]">
                  {studentData.skills?.length || 0}
                </p>
              </div>
            </div>

            {/* Skills Display */}
            {studentData.skills && studentData.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">Skills & Talents</h2>
                <div className="flex flex-wrap gap-3">
                  {studentData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white rounded-lg text-sm font-medium shadow-md"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Registered Events */}
            {registeredEventsWithDetails.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">Registered Events</h2>
                <div className="space-y-3">
                  {registeredEventsWithDetails.map((reg, index) => (
                    <div
                      key={index}
                      className="p-4 bg-purple-50 rounded-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-[#34365C]">
                            {reg.eventDetails?.title || `Event #${reg.eventId}`}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Registered on {formatDate(reg.registeredAt)}
                          </p>
                          {reg.eventDetails && (
                            <p className="text-xs text-gray-600 mt-2">
                              {formatDate(reg.eventDetails.date)} • {reg.eventDetails.location}
                            </p>
                          )}
                        </div>
                        <button className="text-[#8387CC] hover:text-[#4169E1] font-medium text-sm">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 border border-[#DCD0FF]/50 text-center">
                <h2 className="text-xl font-bold text-[#34365C] mb-2">Registered Events</h2>
                <p className="text-gray-500">No events registered yet.</p>
              </div>
            )}

            {/* Bio Section */}
            {studentData.profile?.bio && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{studentData.profile.bio}</p>
              </div>
            )}
          </div>
        )}

        {/* PERSONAL INFO TAB - PRIVATE */}
        {activeTab === 'personal' && isOwnProfile && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
            <h2 className="text-xl font-bold text-[#34365C] mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                  />
                ) : (
                  <p className="text-[var(--text-main)] font-medium">{studentData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--gray-200)] bg-[var(--white)] text-[var(--text-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                  />
                ) : (
                  <p className="text-[var(--text-main)] font-medium">{studentData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.age}
                    onChange={(e) => setEditData({ ...editData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[var(--gray-200)] bg-[var(--white)] text-[var(--text-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                  />
                ) : (
                  <p className="text-[var(--text-main)] font-medium">{studentData.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Gender
                </label>
                <p className="text-[var(--text-main)] font-medium">{studentData.sex}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  School
                </label>
                <p className="text-[var(--text-main)] font-medium">{schoolName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.profile?.phone || ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        profile: { ...editData.profile, phone: e.target.value } as any
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                  />
                ) : (
                  <p className="text-[var(--text-main)] font-medium">
                    {studentData.profile?.phone || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.profile?.address || ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        profile: { ...editData.profile, address: e.target.value } as any
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-800">{studentData.profile?.address || 'N/A'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.profile?.bio || ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        profile: { ...editData.profile, bio: e.target.value } as any
                      })
                    }
                    className="w-full px-3 py-2 border border-[var(--gray-200)] bg-[var(--white)] text-[var(--text-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                    rows={4}
                  />
                ) : (
                  <p className="text-[var(--text-main)] font-medium">
                    {studentData.profile?.bio || 'N/A'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITIES TAB - PRIVATE */}
        {activeTab === 'activities' && isOwnProfile && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
            <h2 className="text-xl font-bold text-[#34365C] mb-4">Event History</h2>
            {registeredEventsWithDetails.length > 0 ? (
              <div className="space-y-3">
                {registeredEventsWithDetails.map((reg, index) => (
                  <div
                    key={index}
                    className="p-4 bg-purple-50 rounded-lg border-2 border-[#DCD0FF]"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-[#34365C]">
                          {reg.eventDetails?.title || `Event #${reg.eventId}`}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Registered: {formatDate(reg.registeredAt)}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Registered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No event history available.</p>
            )}
          </div>
        )}

        {/* SKILLS TAB - PRIVATE */}
        {activeTab === 'skills' && isOwnProfile && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
            <h2 className="text-xl font-bold text-[#34365C] mb-6">My Skills & Talents</h2>
            {studentData.skills && studentData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {studentData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white rounded-lg text-base font-medium shadow-md"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No skills added yet.</p>
            )}
          </div>
        )}

        {/* DRAFTS TAB - PRIVATE */}
        {activeTab === 'drafts' && isOwnProfile && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#34365C] mb-4">Saved Drafts</h2>
            {drafts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drafts.map((draft) => (
                  <PostCard
                    key={draft.id}
                    post={draft}
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
              <div className="bg-white rounded-xl shadow-lg p-12 border border-[#DCD0FF]/50 text-center">
                <p className="text-gray-500">You don't have any saved drafts yet.</p>
              </div>
            )}
          </div>
        )}

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => draftToDelete && deleteDraft(draftToDelete)}
          title="Delete Draft"
          message="Are you sure you want to delete this draft?"
          confirmLabel="Delete Draft"
          cancelLabel="Cancel"
          variant="danger"
        />
      </div>
    </div>
  );
}