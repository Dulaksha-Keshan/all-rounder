"use client";

import { useState, use } from 'react';
import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import { useTeacherStore } from '@/context/useTeacherStore';
import { useSchoolStore } from '@/context/useSchoolStore';
import { useEventStore } from '@/context/useEventStore';
import GoBackButton from '@/components/GoBackButton';
import { useHomeStore } from '@/context/useHomeStore';
import { useUserStore } from '@/context/useUserStore';
import PostCard from '@/app/home/_components/PostCard';
import ConfirmationModal from '@/components/ConfirmationModal';
import ChangePassword from '../../_components/ChangePassword';
import MyAccount from '../../_components/MyAccount';

interface TeacherProfileProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TeacherProfile({ params }: TeacherProfileProps) {
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
  // Get data from stores
  const { getTeacherById } = useTeacherStore();
  const { getSchoolById } = useSchoolStore();
  const { getEventById } = useEventStore();

  // Find the teacher by ID
  const teacher = getTeacherById(id);

  if (!teacher) {
    notFound();
  }

  // Get school name
  const school = getSchoolById(teacher.schoolId);
  const schoolName = school?.name || 'Unknown School';

  // TODO: Get this from your auth system
  // For now, assuming logged-in user is teacher with ID 1
  const loggedInUserId = "1"; // Replace with actual auth
  const loggedInUserType = "teacher"; // Replace with actual auth

  // Check if viewing own profile
  // Check if viewing own profile
  const isOwnProfile = loggedInUserId === teacher.id && loggedInUserType === "teacher";

  const { currentUser, updateProfile } = useUserStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Use persistent currentUser if it's the logged-in user, otherwise use static data
  const initialData = (isOwnProfile && currentUser) ? (currentUser as typeof teacher) : teacher;
  const [teacherData, setTeacherData] = useState(initialData);
  const [editData, setEditData] = useState({ ...initialData });

  const { drafts, deleteDraft } = useHomeStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<number | null>(null);

  // Get full event details for registered events
  const registeredEventsWithDetails = teacherData.registeredEvents?.map(reg => {
    const event = getEventById(reg.eventId);
    return {
      ...reg,
      eventDetails: event
    };
  }) || [];

  const handleSave = () => {
    if (isOwnProfile) {
      updateProfile(editData);
      setTeacherData(editData);
    }
    setIsEditing(false);
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    setEditData({ ...teacherData });
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

  const isFollowing = following.includes(teacher.id);
  const isRequested = sentRequests.includes(teacher.id);

  const handleFollowAction = () => {
    if (isFollowing) {
      unfollowUser(teacher.id);
    } else if (isRequested) {
      cancelFollowRequest(teacher.id);
    } else {
      // For now, assume public profiles for simplicity, or toggle based on logic
      followUser(teacher.id);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <GoBackButton variant="solid" />
        </div>

        {/* Header */}
        <div className="bg-[var(--white)] rounded-xl shadow-lg p-6 mb-6 border border-[var(--gray-200)]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <NextImage
                src={teacherData.photoUrl || '/default-avatar.png'}
                alt={teacherData.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-4 border-[var(--primary-purple)]/20 shadow-md"
              />
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-main)]">{teacherData.name}</h1>
                <div className="mt-1 space-y-1">
                  <p className="text-[var(--text-muted)] font-medium">{teacherData.email}</p>
                  <p className="text-sm text-[var(--gray-400)]">{schoolName}</p>
                </div>

                {/* Social Stats */}
                <div className="flex items-center gap-4 text-sm font-medium mt-3">
                  <div className="text-[var(--text-main)]">
                    <span className="font-bold text-[var(--primary-purple)]">85</span> Followers
                  </div>
                  <div className="text-[var(--text-main)]">
                    <span className="font-bold text-[var(--primary-purple)]">12</span> Following
                  </div>
                </div>
              </div>
            </div>

            {/* Edit buttons - only show if viewing own profile */}
            {isOwnProfile ? (
              <div className="flex gap-2">
                {!isEditing ? (
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
                )}
              </div>
            ) : (
              <div className="mt-2">
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
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[var(--white)] rounded-xl shadow-lg mb-6 border border-[var(--gray-200)]">
          <div className="flex border-b overflow-x-auto">
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
                  onClick={() => setActiveTab('account')}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === 'account'
                    ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                    : 'text-gray-600 hover:text-[#34365C]'
                    }`}
                >
                  My Account
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === 'security'
                    ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                    : 'text-gray-600 hover:text-[#34365C]'
                    }`}
                >
                  Security
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

        {/* OVERVIEW TAB - PUBLIC (Everyone can see) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--white)] p-6 rounded-xl shadow-lg border border-[var(--gray-200)]">
                <p className="text-[var(--text-muted)] text-sm font-medium">Events Registered</p>
                <p className="text-3xl font-bold text-[var(--primary-purple)]">
                  {teacherData.registeredEvents?.length || 0}
                </p>
              </div>
              <div className="bg-[var(--white)] p-6 rounded-xl shadow-lg border border-[var(--gray-200)]">
                <p className="text-[var(--text-muted)] text-sm font-medium">School</p>
                <p className="text-xl font-bold text-[var(--primary-blue)]">{schoolName}</p>
              </div>
              <div className="bg-[var(--white)] p-6 rounded-xl shadow-lg border border-[var(--gray-200)]">
                <p className="text-[var(--text-muted)] text-sm font-medium">Gender</p>
                <p className="text-xl font-bold text-green-500">{teacherData.sex}</p>
              </div>
            </div>

            {/* Registered Events */}
            {registeredEventsWithDetails.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">Registered Events</h2>
                <div className="space-y-3">
                  {registeredEventsWithDetails.map((reg, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-all"
                    >
                      <div>
                        <h4 className="font-semibold text-[#34365C]">
                          {reg.eventDetails?.title || `Event #${reg.eventId}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Registered on {formatDate(reg.registeredAt)}
                        </p>
                        {reg.eventDetails && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(reg.eventDetails.startDate)} • {reg.eventDetails.location}
                          </p>
                        )}
                      </div>
                      <button className="px-4 py-2 text-[#8387CC] hover:text-[#4169E1] font-medium transition-colors">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">Registered Events</h2>
                <p className="text-gray-500 text-center py-8">No events registered yet.</p>
              </div>
            )}

            {/* Bio Section */}
            {teacherData.profile?.bio && (
              <div className="bg-[var(--white)] rounded-xl shadow-lg p-6 border border-[var(--gray-200)]">
                <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">About</h2>
                <p className="text-[var(--text-main)] leading-relaxed font-medium">{teacherData.profile.bio}</p>
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
                <label className="block text-sm font-medium text-[#34365C] mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                  />
                ) : (
                  <p className="text-gray-800">{teacherData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                  />
                ) : (
                  <p className="text-gray-800">{teacherData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">School</label>
                <p className="text-gray-800">{schoolName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">Gender</label>
                <p className="text-gray-800">{teacherData.sex}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.profile?.phone || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      profile: { ...editData.profile, phone: e.target.value } as any
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                  />
                ) : (
                  <p className="text-gray-800">{teacherData.profile?.phone || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">Zip Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.profile?.zipCode || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      profile: { ...editData.profile, zipCode: e.target.value } as any
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                  />
                ) : (
                  <p className="text-gray-800">{teacherData.profile?.zipCode || 'N/A'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#34365C] mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    value={editData.profile?.address || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      profile: { ...editData.profile, address: e.target.value } as any
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-800">{teacherData.profile?.address || 'N/A'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#34365C] mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editData.profile?.bio || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      profile: { ...editData.profile, bio: e.target.value } as any
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-800">{teacherData.profile?.bio || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITIES TAB - PRIVATE */}
        {activeTab === 'activities' && isOwnProfile && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* ACCOUNT TAB - PRIVATE */}
        {activeTab === 'account' && isOwnProfile && (
          <MyAccount teacher={teacherData} />
        )}

        {/* SECURITY TAB - PRIVATE */}
        {activeTab === 'security' && isOwnProfile && (
          <ChangePassword />
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