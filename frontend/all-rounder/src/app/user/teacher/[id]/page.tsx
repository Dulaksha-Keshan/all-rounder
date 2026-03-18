"use client";

import { useState, use, useEffect, useMemo } from 'react';
import NextImage from 'next/image';
import { notFound } from 'next/navigation';
// import GoBackButton from '@/components/GoBackButton'; // Uncomment if needed
import { useTeacherStore } from '@/context/useTeacherStore';
import { useSchoolStore } from '@/context/useSchoolStore';
import { useHomeStore } from '@/context/useHomeStore';
import { usePostStore } from '@/context/usePostStore';
import { useUserStore } from '@/context/useUserStore';
import PostCard from '@/app/home/_components/PostCard';
import ProfilePostsGallery from '@/app/user/_components/ProfilePostsGallery';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PostEntity } from '@/app/_type/type';
import ChangePassword from '../../_components/ChangePassword';
import MyAccount from '../../_components/MyAccount';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const EMPTY_POST_IDS: string[] = [];

interface TeacherProfileProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TeacherProfile({ params }: TeacherProfileProps) {
  const { id } = use(params);

  // --- STORES ---
  const { currentUser, userRole, updateProfile } = useUserStore();
  const { getSchoolById, schools, fetchSchools } = useSchoolStore();
  const { drafts, deleteDraft } = useHomeStore();
  const postsById = usePostStore((state) => state.postsById);
  const myPostIds = usePostStore((state) => state.myPostIds);
  const fetchMyPosts = usePostStore((state) => state.fetchMyPosts);
  const fetchUserPosts = usePostStore((state) => state.fetchUserPosts);
  const userPostIds = usePostStore((state) => state.userPostIdsByKey[id] ?? EMPTY_POST_IDS);
  const isFetchingPosts = usePostStore((state) => state.isFetchingPosts);

  // We will add these to your teacher store in the next step!
  const {
    getTeacherById,
    pendingRequests = [],
    approvedRequests = [],
    rejectedRequests = [],
    fetchVerificationRequests,
    getAllVerificationRequests,
    updateVerificationStatus
  } = useTeacherStore(); 
  const processedRequests = [...approvedRequests, ...rejectedRequests].sort((a, b) => {
    // Sort by most recently updated
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });
  // --- PROFILE LOGIC ---
  const isOwnProfile = currentUser?.uid === id && userRole === 'TEACHER';
  const viewedTeacher = isOwnProfile ? currentUser : getTeacherById(id);

  // Fetch schools if they aren't loaded yet
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

  // Hydrate Verification Requests if it's the teacher's own profile
  useEffect(() => {
    if (isOwnProfile && currentUser?.uid && fetchVerificationRequests) {
      fetchVerificationRequests(currentUser.uid);
    }
  }, [isOwnProfile, currentUser?.uid, fetchVerificationRequests]);

  // --- LOCAL STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [requestSubTab, setRequestSubTab] = useState<'pending' | 'processed'>('pending');
  const [hasLoadedAllRequests, setHasLoadedAllRequests] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // Fetch full verification history only when user opens the history view.
  useEffect(() => {
    if (
      isOwnProfile &&
      activeTab === 'requests' &&
      requestSubTab === 'processed' &&
      !hasLoadedAllRequests
    ) {
      getAllVerificationRequests();
      setHasLoadedAllRequests(true);
    }
  }, [
    isOwnProfile,
    activeTab,
    requestSubTab,
    hasLoadedAllRequests,
    getAllVerificationRequests,
  ]);

  // Reset lazy-load state when profile identity changes.
  useEffect(() => {
    setHasLoadedAllRequests(false);
    setRequestSubTab('pending');
  }, [id]);

  // Draft Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  // --- HELPERS ---
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

  // Verification Action Modal State
  const [verificationModal, setVerificationModal] = useState<{
    isOpen: boolean;
    action: 'APPROVED' | 'REJECTED' | null;
    requestId: string | null;
    requestLabel: string;
    remarks: string;
  }>({ isOpen: false, action: null, requestId: null, requestLabel: "", remarks: "" });

  // Keep edit form in sync
  useEffect(() => {
    if (viewedTeacher) {
      setEditData({ ...viewedTeacher });
    }
  }, [viewedTeacher]);

  const profilePosts = useMemo(() => {
    const profilePostIds = isOwnProfile ? myPostIds : userPostIds;
    return profilePostIds
      .map((postId) => postsById[postId])
      .filter((post): post is PostEntity => Boolean(post));
  }, [isOwnProfile, myPostIds, userPostIds, postsById]);

  if (!viewedTeacher) {
    notFound();
  }

  // --- HELPERS ---
  const school = getSchoolById(viewedTeacher.school_id || viewedTeacher.schoolId);
  const schoolName = school?.name || 'Unknown School';

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const registeredEventsWithDetails: any[] = [];

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
    setEditData({ ...viewedTeacher });
    setIsEditing(false);
  };

  // Open the confirmation modal for Verification
  const handleVerificationAction = (requestId: string, requestLabel: string, action: 'APPROVED' | 'REJECTED') => {
    setVerificationModal({ isOpen: true, action, requestId, requestLabel, remarks: "" });
  };

  // Submit the verification to backend
  const confirmVerificationAction = async () => {
    if (verificationModal.requestId && verificationModal.action && updateVerificationStatus) {
      try {
        await updateVerificationStatus(
          verificationModal.requestId,
          verificationModal.action,
          verificationModal.remarks
        );
        // The store action should handle updating the local arrays (moving from pending to processed)
        setVerificationModal({ isOpen: false, action: null, requestId: null, requestLabel: "", remarks: "" });
      } catch (error) {
        console.error("Failed to update verification status:", error);
        alert("Failed to process request.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto mt-20">

        {/* Header */}
        <div className="bg-[var(--white)] rounded-xl shadow-lg p-8 mb-6 border border-[var(--gray-200)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full -z-10 opacity-50" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 z-10">
            <NextImage
              src={viewedTeacher.profile_picture || '/icons/default-avatar.png'}
              alt={viewedTeacher.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover border-4 border-[var(--primary-purple)]/20 shadow-md flex-shrink-0"
            />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-[var(--text-main)] mb-1">
                {viewedTeacher.name}
              </h1>
              <p className="text-[var(--text-muted)] font-medium mb-1">{viewedTeacher.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 text-sm text-[var(--gray-400)] mb-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary-purple)]"></span>
                  {schoolName}
                </span>
                <span className="hidden md:inline">•</span>
                <span>{viewedTeacher.subject || 'General Educator'}</span>
              </div>

              {/* Badges */}
              <div className="flex justify-center md:justify-start gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                  Verified Educator
                </span>
              </div>
            </div>

            {/* Edit buttons - only show if viewing own profile */}
            {isOwnProfile && (
              <div className="mt-4 md:mt-0 flex gap-3 w-full md:w-auto justify-center">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[var(--primary-blue)] to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-bold w-full md:w-auto"
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
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[var(--white)] rounded-xl shadow-md mb-6 border border-[var(--gray-200)] overflow-x-auto hide-scrollbar">
          <div className="flex w-max min-w-full border-b border-gray-100">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'overview'
                ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-blue-50/50'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-50'
                }`}
            >
              Overview
            </button>

            {isOwnProfile && (
              <>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'requests'
                    ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-blue-50/50'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-50'
                    }`}
                >
                  Student Requests
                  {pendingRequests.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {pendingRequests.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'personal'
                    ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-blue-50/50'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-50'
                    }`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'activities'
                    ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-blue-50/50'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-50'
                    }`}
                >
                  My Activities
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'drafts'
                    ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-blue-50/50'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-50'
                    }`}
                >
                  My Drafts
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'account'
                    ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-blue-50/50'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-50'
                    }`}
                >
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${activeTab === 'security'
                    ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-blue-50/50'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-50'
                    }`}
                >
                  Security
                </button>
              </>
            )}
          </div>
        </div>

        {/* OVERVIEW TAB - PUBLIC */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--white)] p-6 rounded-xl shadow-sm border border-[var(--gray-200)] text-center">
                <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">Events Hosted</p>
                <p className="text-3xl font-black text-[var(--primary-purple)]">0</p>
              </div>
              <div className="bg-[var(--white)] p-6 rounded-xl shadow-sm border border-[var(--gray-200)] text-center">
                <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">School Affiliation</p>
                <p className="text-lg font-bold text-[var(--primary-blue)] truncate px-2">{schoolName}</p>
              </div>
              <div className="bg-[var(--white)] p-6 rounded-xl shadow-sm border border-[var(--gray-200)] text-center">
                <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-2">Designation</p>
                <p className="text-lg font-bold text-[#34365C] truncate px-2">{viewedTeacher.designation || 'Educator'}</p>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-[var(--white)] rounded-xl shadow-sm p-8 border border-[var(--gray-200)]">
              <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 border-b pb-2">About Me</h2>
              {viewedTeacher.about ? (
                <p className="text-[var(--text-main)] leading-relaxed font-medium whitespace-pre-wrap">{viewedTeacher.about}</p>
              ) : (
                <p className="text-gray-400 italic">This teacher hasn't written a bio yet.</p>
              )}
            </div>

            {/* Registered Events */}
            {registeredEventsWithDetails.length > 0 && (
              <div className="bg-[var(--white)] rounded-xl shadow-sm p-8 border border-[var(--gray-200)]">
                <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 border-b pb-2">Registered Events</h2>
                <div className="space-y-3">
                  {registeredEventsWithDetails.map((reg, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-100 transition-all">
                      <div>
                        <h4 className="font-semibold text-[#34365C]">{reg.eventDetails?.title || `Event #${reg.eventId}`}</h4>
                        <p className="text-sm text-gray-600">Registered on {formatDate(reg.registeredAt)}</p>
                      </div>
                      <button className="px-4 py-2 text-[var(--primary-blue)] hover:text-blue-700 font-medium transition-colors">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[var(--white)] rounded-xl shadow-sm p-6 border border-[var(--gray-200)]">
              <div className="mb-5 border-b border-[var(--gray-200)] pb-3">
                <h2 className="text-lg font-bold text-[var(--text-main)]">Posts</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {isOwnProfile ? 'Your recent posts and shared updates.' : `${viewedTeacher.name}'s recent posts and shared updates.`}
                </p>
              </div>

              <ProfilePostsGallery
                posts={profilePosts}
                isLoading={isFetchingPosts}
                emptyMessage={isOwnProfile ? "You haven't posted anything yet." : "No posts published yet."}
              />
            </div>
          </div>
        )}

        {/* STUDENT REQUESTS TAB - PRIVATE */}
        {activeTab === 'requests' && isOwnProfile && (
          <div className="bg-[var(--white)] rounded-xl shadow-sm p-6 md:p-8 border border-[var(--gray-200)] animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
              <h2 className="text-xl font-bold text-[var(--text-main)]">Verification Requests</h2>

              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setRequestSubTab('pending')}
                  className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${requestSubTab === 'pending' ? 'bg-white text-[var(--primary-blue)] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Pending ({pendingRequests.length})
                </button>
                <button
                  onClick={() => setRequestSubTab('processed')}
                  className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${requestSubTab === 'processed' ? 'bg-white text-[var(--primary-blue)] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  History
                </button>
              </div>
            </div>

            {requestSubTab === 'pending' ? (
              <div className="space-y-4">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((req: any) => (
                    <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-yellow-200 bg-yellow-50/50 rounded-xl gap-4 transition-all hover:shadow-md">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#34365C] text-lg">{req.userName || `Request #${String(req.id || '').slice(-6).toUpperCase()}`}</h4>
                          <p className="text-sm text-gray-600">{req.verificationMethod} • Requested: {formatDate(req.createdAt)}</p>
                          <p className="text-xs text-gray-500 mt-1">Approver: {req.approverName || 'Not assigned yet'}</p>
                          <p className="text-xs text-gray-500 mt-1">Remarks: {req.remarks || 'No remarks'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleVerificationAction(req.id, req.userName || `Request #${String(req.id || '').slice(-6).toUpperCase()}`, 'APPROVED')}
                          className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-all text-sm flex justify-center items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleVerificationAction(req.id, req.userName || `Request #${String(req.id || '').slice(-6).toUpperCase()}`, 'REJECTED')}
                          className="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-bold transition-all text-sm flex justify-center items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-1">All caught up!</h3>
                    <p className="text-gray-500 text-sm">You have no pending student verification requests.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {processedRequests.length > 0 ? (
                  processedRequests.map((req: any) => (
                    <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl gap-4">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${req.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {req.verificationStatus === 'APPROVED' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#34365C]">{req.userName || `Request #${String(req.id || '').slice(-6).toUpperCase()}`}</h4>
                          <p className="text-sm text-gray-500">{req.verificationMethod} • Processed: {formatDate(req.updatedAt || req.createdAt)}</p>
                          <p className="text-xs text-gray-500 mt-1">Approver: {req.approverName || 'No approver'}</p>
                          <p className="text-xs text-gray-500 mt-1">Remarks: {req.remarks || 'No remarks'}</p>
                        </div>
                      </div>
                      <div className="w-full md:w-auto text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                          {req.verificationStatus}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No history available.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* PERSONAL INFO TAB - PRIVATE */}
        {activeTab === 'personal' && isOwnProfile && (
          <div className="bg-[var(--white)] rounded-xl shadow-sm p-8 border border-[var(--gray-200)] animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-[#34365C]">Account Settings</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-[var(--primary-blue)] hover:underline">Edit Info</button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Full Name</label>
                {isEditing ? (
                  <input type="text" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-4 py-2 border border-[var(--gray-200)] rounded-lg focus:ring-2 focus:ring-[var(--primary-purple)] outline-none" />
                ) : (
                  <p className="text-[var(--text-main)] font-medium text-lg">{viewedTeacher.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Email</label>
                <p className="text-[var(--gray-400)] font-medium text-lg bg-gray-50 px-3 py-1 rounded border border-transparent inline-block">{viewedTeacher.email}</p>
                {isEditing && <p className="text-xs text-orange-500 mt-1">Email cannot be changed.</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Subject Specialty</label>
                {isEditing ? (
                  <input type="text" value={editData.subject || ''} onChange={(e) => setEditData({ ...editData, subject: e.target.value })} className="w-full px-4 py-2 border border-[var(--gray-200)] rounded-lg focus:ring-2 focus:ring-[var(--primary-purple)] outline-none" />
                ) : (
                  <p className="text-[var(--text-main)] font-medium text-lg">{viewedTeacher.subject || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Designation</label>
                {isEditing ? (
                  <input type="text" value={editData.designation || ''} onChange={(e) => setEditData({ ...editData, designation: e.target.value })} className="w-full px-4 py-2 border border-[var(--gray-200)] rounded-lg focus:ring-2 focus:ring-[var(--primary-purple)] outline-none" />
                ) : (
                  <p className="text-[var(--text-main)] font-medium text-lg">{viewedTeacher.designation || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Phone</label>
                {isEditing ? (
                  <input type="tel" value={editData.contact_number || ''} onChange={(e) => setEditData({ ...editData, contact_number: e.target.value })} className="w-full px-4 py-2 border border-[var(--gray-200)] rounded-lg focus:ring-2 focus:ring-[var(--primary-purple)] outline-none" />
                ) : (
                  <p className="text-[var(--text-main)] font-medium text-lg">{viewedTeacher.contact_number || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Staff ID</label>
                <p className="text-[var(--text-main)] font-medium text-lg">{viewedTeacher.staff_id || 'N/A'}</p>
              </div>

              <div className="md:col-span-2 mt-4">
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Bio / About</label>
                {isEditing ? (
                  <textarea value={editData.about || ''} onChange={(e) => setEditData({ ...editData, about: e.target.value })} className="w-full px-4 py-3 border border-[var(--gray-200)] rounded-lg focus:ring-2 focus:ring-[var(--primary-purple)] outline-none resize-y" rows={4} placeholder="Write something about your teaching experience..." />
                ) : (
                  <p className="text-[var(--text-main)] font-medium">{viewedTeacher.about || 'N/A'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 pt-6 border-t border-[var(--gray-200)] flex justify-end gap-3">
                <button onClick={handleCancel} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2.5 bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-blue)] text-white rounded-lg shadow hover:shadow-lg transition-all font-medium">Save Changes</button>
              </div>
            )}
          </div>
        )}

        {/* ACCOUNT TAB - PRIVATE */}
        {activeTab === 'account' && isOwnProfile && (
          <div className="animate-fadeIn">
            <MyAccount teacher={viewedTeacher} />
          </div>
        )}

        {/* SECURITY TAB - PRIVATE */}
        {activeTab === 'security' && isOwnProfile && (
          <div className="animate-fadeIn">
            <ChangePassword />
          </div>
        )}

        {/* ACTIVITIES TAB - PRIVATE */}
        {activeTab === 'activities' && isOwnProfile && (
          <div className="bg-[var(--white)] rounded-xl shadow-sm p-8 border border-[var(--gray-200)] animate-fadeIn">
            <h2 className="text-xl font-bold text-[#34365C] mb-6 border-b pb-4">Event History</h2>
            {registeredEventsWithDetails.length > 0 ? (
              <div className="space-y-4">
                {/* Event Mapping */}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4 text-2xl">📅</div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">No Events Hosted</h3>
                <p className="text-gray-500 text-sm">You haven't hosted or registered for any events.</p>
              </div>
            )}
          </div>
        )}

        {/* DRAFTS TAB - PRIVATE */}
        {activeTab === 'drafts' && isOwnProfile && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-[var(--text-main)] mb-4 pl-2">Saved Drafts</h2>
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
              <div className="bg-[var(--white)] rounded-xl shadow-sm p-16 border border-[var(--gray-200)] text-center">
                <p className="text-[var(--gray-400)] font-medium">You don't have any saved drafts yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            if (draftToDelete) {
              return deleteDraft(draftToDelete);
            }
          }}
          title="Delete Draft"
          message="Are you sure you want to delete this draft? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
        />

        {/* NEW: Verification Action Modal */}
        <ConfirmationModal
          isOpen={verificationModal.isOpen}
          onClose={() =>
            setVerificationModal({ isOpen: false, action: null, requestId: null, requestLabel: "", remarks: "" })
          }
          onConfirm={confirmVerificationAction}
          title={`${verificationModal.action === 'APPROVED' ? 'Accept' : 'Reject'} Verification`}
          message={`Are you sure you want to ${verificationModal.action === 'APPROVED' ? 'approve' : 'reject'} ${verificationModal.requestLabel}?`}
          confirmLabel={verificationModal.action === 'APPROVED' ? 'Yes, Accept' : 'Yes, Reject'}
          cancelLabel="Cancel"
          variant={verificationModal.action === 'APPROVED' ? 'success' : 'danger'}
          showRemarksField
          remarksValue={verificationModal.remarks}
          onRemarksChange={(remarks) => setVerificationModal((prev) => ({ ...prev, remarks }))}
          remarksPlaceholder="Enter remarks for this decision"
          remarksRequired
          closeOnConfirm={false}
        />
      </div>
    </div>
  );
}