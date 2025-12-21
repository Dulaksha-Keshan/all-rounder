"use client";

import { useState, use } from 'react';
import { Teachers, Schools} from '@/app/_data/data';
import { Events } from '@/app/events/_data/events';
import { notFound } from 'next/navigation';
import ChangePassword from '../../_components/ChangePassword';
import MyAccount from '../../_components/MyAccount';

interface TeacherProfileProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TeacherProfile({ params }: TeacherProfileProps) {
  const { id } = use(params);

  // Find the teacher by ID
  const teacher = Teachers.find(t => t.id === Number(id));
  
  if (!teacher) {
    notFound();
  }

  // Get school name
  const school = Schools.find(s => s.id === teacher.schoolId);
  const schoolName = school?.name || 'Unknown School';

  // TODO: Get this from your auth system
  // For now, assuming logged-in user is teacher with ID 1
  const loggedInUserId = 1; // Replace with actual auth
  const loggedInUserType = "teacher"; // Replace with actual auth
  
  // Check if viewing own profile
  const isOwnProfile = loggedInUserId === teacher.id && loggedInUserType === "teacher";

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [teacherData, setTeacherData] = useState(teacher);
  const [editData, setEditData] = useState({ ...teacher });

  // Get full event details for registered events
  const registeredEventsWithDetails = teacherData.registeredEvents?.map(reg => {
    const event = Events.find(e => e.id === Number(reg.eventId));
    return {
      ...reg,
      eventDetails: event
    };
  }) || [];

  const handleSave = () => {
    setTeacherData(editData);
    setIsEditing(false);
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    setEditData({ ...teacherData });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FF] via-[#DCD0FF]/20 to-[#F8F8FF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-[#DCD0FF]/50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <img 
                src={teacherData.photoUrl} 
                alt={teacherData.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#DCD0FF]"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#34365C]">{teacherData.name}</h1>
                <p className="text-gray-600 mt-1">{teacherData.email}</p>
                <p className="text-sm text-gray-500 mt-1">{schoolName}</p>
              </div>
            </div>
            
            {/* Edit buttons - only show if viewing own profile */}
            {isOwnProfile && (
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#8387CC] text-white rounded-lg hover:bg-[#4169E1] transition-colors"
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
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-[#DCD0FF]/50">
          <div className="flex border-b overflow-x-auto">
            {/* Overview tab - always visible */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                  : 'text-gray-600 hover:text-[#34365C]'
              }`}
            >
              Overview
            </button>
            
            {/* Private tabs - only show if viewing own profile */}
            {isOwnProfile && (
              <>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'personal'
                      ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                      : 'text-gray-600 hover:text-[#34365C]'
                  }`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'activities'
                      ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                      : 'text-gray-600 hover:text-[#34365C]'
                  }`}
                >
                  My Activities
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'account'
                      ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                      : 'text-gray-600 hover:text-[#34365C]'
                  }`}
                >
                  My Account
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'security'
                      ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
                      : 'text-gray-600 hover:text-[#34365C]'
                  }`}
                >
                  Security
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
              <div className="bg-white p-6 rounded-xl shadow-lg border border-[#DCD0FF]/50">
                <p className="text-gray-600 text-sm">Events Registered</p>
                <p className="text-3xl font-bold text-[#8387CC]">
                  {teacherData.registeredEvents?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-[#DCD0FF]/50">
                <p className="text-gray-600 text-sm">School</p>
                <p className="text-xl font-bold text-[#4169E1]">{schoolName}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-[#DCD0FF]/50">
                <p className="text-gray-600 text-sm">Gender</p>
                <p className="text-xl font-bold text-green-600">{teacherData.sex}</p>
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
            {teacherData.profile?.bio && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#DCD0FF]/50">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{teacherData.profile.bio}</p>
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
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
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
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
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
      </div>
    </div>
  );
}