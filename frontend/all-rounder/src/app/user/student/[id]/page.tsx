"use client";

import { useState, use } from 'react';
import NextImage from 'next/image';
import { Students, Schools } from '@/app/_data/data';
import { Events } from '@/app/events/_data/events';
import { notFound } from 'next/navigation';
import GoBackButton from '@/components/GoBackButton';
import { useHomeStore } from '@/context/useHomeStore';
import PostCard from '@/app/home/_components/PostCard';
import ConfirmationModal from '@/components/ConfirmationModal';

interface StudentProfileProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentProfile({ params }: StudentProfileProps) {
  const { id } = use(params);

  // Find the student by ID
  const student = Students.find(s => s.id === Number(id));

  if (!student) {
    notFound();
  }

  // Get school name
  const school = Schools.find(s => s.id === student.schoolId);
  const schoolName = school?.name || 'Unknown School';

  // TODO: Get this from your auth system
  const loggedInUserId = 1; // Replace with actual auth
  const loggedInUserType = "student"; // Replace with actual auth

  // Check if viewing own profile
  const isOwnProfile = loggedInUserId === student.id && loggedInUserType === "student";

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [studentData, setStudentData] = useState(student);
  const [editData, setEditData] = useState({ ...student });
  const { drafts, deleteDraft, likePost, commentPost } = useHomeStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<number | null>(null);

  // Get full event details for registered events
  const registeredEventsWithDetails = studentData.registeredEvents?.map(reg => {
    const event = Events.find(e => e.id === Number(reg.eventId));
    return {
      ...reg,
      eventDetails: event
    };
  }) || [];

  const handleSave = () => {
    setStudentData(editData);
    setIsEditing(false);
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    setEditData({ ...studentData });
    setIsEditing(false);
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
                src={studentData.photoUrl}
                alt={studentData.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-4 border-[var(--primary-purple)]/20 shadow-md"
              />
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-main)]">{studentData.name}</h1>
                <p className="text-[var(--text-muted)] mt-1 font-medium">{studentData.email}</p>
                <p className="text-sm text-[var(--gray-400)] mt-1">{schoolName} • Age {studentData.age}</p>
              </div>
            </div>

            {/* Edit buttons - only show if viewing own profile */}
            {isOwnProfile && (
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[var(--white)] p-6 rounded-xl shadow-lg border border-[var(--gray-200)]">
                <p className="text-gray-600 text-sm">Events Registered</p>
                <p className="text-3xl font-bold text-[#8387CC]">
                  {studentData.registeredEvents?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-[#DCD0FF]/50">
                <p className="text-gray-600 text-sm">School</p>
                <p className="text-lg font-bold text-[#4169E1]">{schoolName}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-[#DCD0FF]/50">
                <p className="text-gray-600 text-sm">Age</p>
                <p className="text-3xl font-bold text-green-600">{studentData.age}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-[#DCD0FF]/50">
                <p className="text-gray-600 text-sm">Skills</p>
                <p className="text-3xl font-bold text-purple-600">
                  {studentData.skills?.length || 0}
                </p>
              </div>
            </div>

            {/* Skills Display */}
            {studentData.skills && studentData.skills.length > 0 && (
              <div className="bg-[var(--white)] rounded-xl shadow-lg p-6 border border-[var(--gray-200)]">
                <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">Skills & Talents</h2>
                <div className="flex flex-wrap gap-2">
                  {studentData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-blue)] text-white rounded-full text-sm font-bold shadow-md"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Registered Events */}
            {registeredEventsWithDetails.length > 0 ? (
              <div className="bg-[var(--white)] rounded-xl shadow-lg p-6 border border-[var(--gray-200)]">
                <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">Registered Events</h2>
                <div className="space-y-3">
                  {registeredEventsWithDetails.map((reg, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-[var(--primary-blue)]/5 rounded-lg border-2 border-[var(--gray-200)] hover:border-[var(--primary-purple)] transition-all"
                    >
                      <div>
                        <h4 className="font-semibold text-[#34365C]">
                          {reg.eventDetails?.title || `Event #${reg.eventId}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Registered on {new Date(reg.registeredAt).toLocaleDateString()}
                        </p>
                        {reg.eventDetails && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(reg.eventDetails.date).toLocaleDateString()} • {reg.eventDetails.location}
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
            {studentData.profile?.bio && (
              <div className="bg-[var(--white)] rounded-xl shadow-lg p-6 border border-[var(--gray-200)]">
                <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">About</h2>
                <p className="text-[var(--text-main)] leading-relaxed font-medium">{studentData.profile.bio}</p>
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
                  <p className="text-gray-800">{studentData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">Email</label>
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
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">Age</label>
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
                <label className="block text-sm font-medium text-[#34365C] mb-2">Gender</label>
                <p className="text-gray-800">{studentData.sex}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">School</label>
                <p className="text-gray-800">{schoolName}</p>
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
                  <p className="text-gray-800">{studentData.profile?.phone || 'N/A'}</p>
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
                  <p className="text-gray-800">{studentData.profile?.address || 'N/A'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editData.profile?.bio || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      profile: { ...editData.profile, bio: e.target.value } as any
                    })}
                    className="w-full px-3 py-2 border border-[var(--gray-200)] bg-[var(--white)] text-[var(--text-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                    rows={4}
                  />
                ) : (
                  <p className="text-[var(--text-main)] font-medium">{studentData.profile?.bio || 'N/A'}</p>
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
                          Registered: {new Date(reg.registeredAt).toLocaleDateString()}
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