// "use client";

// import { useState } from 'react';
// import ChangePassword from '../_components/ChangePassword';
// import MyAccount from '../_components/MyAccount';
// import { Students } from '@/app/_data/data'; // Adjust path as needed

// export default function StudentAccountPage() {
//   // Use the first student from your data file as the logged-in user
//   // Later, you'll filter by actual logged-in user ID
//   const [studentData, setStudentData] = useState(Students[0]);

//   const [activeTab, setActiveTab] = useState('overview');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({ ...studentData });
  
//   // Set this to true if viewing own profile, false if viewing someone else's profile
//   // You can determine this by comparing logged-in user ID with profile user ID
//   const [isOwnProfile, setIsOwnProfile] = useState(true);

//   const handleSave = () => {
//     setStudentData(editData);
//     setIsEditing(false);
//     alert('Changes saved successfully!');
//   };

//   const handleCancel = () => {
//     setEditData({ ...studentData });
//     setIsEditing(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <div className="flex justify-between items-start">
//             <div className="flex items-center gap-6">
//               <img 
//                 src={studentData.photoUrl} 
//                 alt={studentData.name}
//                 className="w-24 h-24 rounded-full object-cover border-4 border-[#DCD0FF]"
//               />
//               <div>
//                 <h1 className="text-3xl font-bold text-[#34365C]">{studentData.name}</h1>
//                 <p className="text-gray-600 mt-1">{studentData.email}</p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {studentData.school} • Age {studentData.age}
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               {isOwnProfile && !isEditing ? (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="px-4 py-2 bg-[#8387CC] text-white rounded-lg hover:bg-[#4169E1] transition-colors"
//                 >
//                   Edit Profile
//                 </button>
//               ) : isOwnProfile && isEditing ? (
//                 <>
//                   <button
//                     onClick={handleSave}
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : null}
//             </div>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="bg-white rounded-xl shadow-sm mb-6">
//           <div className="flex border-b overflow-x-auto">
//             <button
//               onClick={() => setActiveTab('overview')}
//               className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
//                 activeTab === 'overview'
//                   ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
//                   : 'text-gray-600 hover:text-[#34365C]'
//               }`}
//             >
//               Overview
//             </button>
            
//             {/* Only show private tabs if viewing own profile */}
//             {isOwnProfile && (
//               <>
//                 <button
//                   onClick={() => setActiveTab('personal')}
//                   className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
//                     activeTab === 'personal'
//                       ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
//                       : 'text-gray-600 hover:text-[#34365C]'
//                   }`}
//                 >
//                   Personal Info
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('activities')}
//                   className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
//                     activeTab === 'activities'
//                       ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
//                       : 'text-gray-600 hover:text-[#34365C]'
//                   }`}
//                 >
//                   My Activities
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('account')}
//                   className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
//                     activeTab === 'account'
//                       ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
//                       : 'text-gray-600 hover:text-[#34365C]'
//                   }`}
//                 >
//                   My Account
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('security')}
//                   className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
//                     activeTab === 'security'
//                       ? 'border-b-2 border-[#8387CC] text-[#8387CC]'
//                       : 'text-gray-600 hover:text-[#34365C]'
//                   }`}
//                 >
//                   Security
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Content Area */}
//         {activeTab === 'overview' && (
//           <div className="space-y-6">
//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white p-6 rounded-xl shadow-sm">
//                 <p className="text-gray-600 text-sm">Events Registered</p>
//                 <p className="text-3xl font-bold text-[#8387CC]">{studentData.registeredEvents?.length || 0}</p>
//               </div>
//               <div className="bg-white p-6 rounded-xl shadow-sm">
//                 <p className="text-gray-600 text-sm">Skills</p>
//                 <p className="text-3xl font-bold text-[#4169E1]">{studentData.skills?.length || 0}</p>
//               </div>
//               <div className="bg-white p-6 rounded-xl shadow-sm">
//                 <p className="text-gray-600 text-sm">Followers</p>
//                 <p className="text-3xl font-bold text-green-600">{studentData.stats?.followers || 0}</p>
//               </div>
//               <div className="bg-white p-6 rounded-xl shadow-sm">
//                 <p className="text-gray-600 text-sm">Following</p>
//                 <p className="text-3xl font-bold text-purple-600">{studentData.stats?.following || 0}</p>
//               </div>
//             </div>

//             {/* My Skills */}
//             {studentData.skills && studentData.skills.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm p-6">
//                 <h2 className="text-xl font-bold text-[#34365C] mb-4">My Skills</h2>
//                 <div className="flex flex-wrap gap-3">
//                   {studentData.skills.map((skill, index) => (
//                     <span 
//                       key={index}
//                       className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full font-medium"
//                     >
//                       {skill.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Registered Events */}
//             {studentData.registeredEvents && studentData.registeredEvents.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm p-6">
//                 <h2 className="text-xl font-bold text-[#34365C] mb-4">Registered Events</h2>
//                 <div className="space-y-3">
//                   {studentData.registeredEvents.map((event, index) => (
//                     <div 
//                       key={index}
//                       className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-all"
//                     >
//                       <div>
//                         <h4 className="font-semibold text-[#34365C]">Event #{event.eventId}</h4>
//                         <p className="text-sm text-gray-600">
//                           Registered on {new Date(event.registeredAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <button className="px-4 py-2 text-[#8387CC] hover:text-[#4169E1] font-medium transition-colors">
//                         View Details →
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Bio Section */}
//             {studentData.profile?.bio && (
//               <div className="bg-white rounded-xl shadow-sm p-6">
//                 <h2 className="text-xl font-bold text-[#34365C] mb-4">About Me</h2>
//                 <p className="text-gray-700 leading-relaxed">{studentData.profile.bio}</p>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'personal' && (
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-xl font-bold text-[#34365C] mb-6">Personal Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-[#34365C] mb-2">Full Name</label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     value={editData.name}
//                     onChange={(e) => setEditData({...editData, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
//                   />
//                 ) : (
//                   <p className="text-gray-800">{studentData.name}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#34365C] mb-2">Email</label>
//                 {isEditing ? (
//                   <input
//                     type="email"
//                     value={editData.email}
//                     onChange={(e) => setEditData({...editData, email: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
//                   />
//                 ) : (
//                   <p className="text-gray-800">{studentData.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#34365C] mb-2">Phone</label>
//                 {isEditing ? (
//                   <input
//                     type="tel"
//                     value={editData.profile?.phone || ''}
//                     onChange={(e) => setEditData({
//                       ...editData, 
//                       profile: {
//                         bio: editData.profile?.bio || '',
//                         phone: e.target.value,
//                         address: editData.profile?.address || '',
//                         zipCode: editData.profile?.zipCode || ''
//                       }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
//                   />
//                 ) : (
//                   <p className="text-gray-800">{studentData.profile?.phone || 'N/A'}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#34365C] mb-2">Age</label>
//                 <p className="text-gray-800">{studentData.age} years old</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#34365C] mb-2">School</label>
//                 <p className="text-gray-800">{studentData.school}</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#34365C] mb-2">Gender</label>
//                 <p className="text-gray-800">{studentData.sex}</p>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-[#34365C] mb-2">Address</label>
//                 {isEditing ? (
//                   <textarea
//                     value={editData.profile?.address || ''}
//                     onChange={(e) => setEditData({
//                       ...editData, 
//                       profile: {
//                         bio: editData.profile?.bio || '',
//                         phone: editData.profile?.phone || '',
//                         address: e.target.value,
//                         zipCode: editData.profile?.zipCode || ''
//                       }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
//                     rows={3}
//                   />
//                 ) : (
//                   <p className="text-gray-800">{studentData.profile?.address || 'N/A'}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#34365C] mb-2">Zip Code</label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     value={editData.profile?.zipCode || ''}
//                     onChange={(e) => setEditData({
//                       ...editData, 
//                       profile: {
//                         bio: editData.profile?.bio || '',
//                         phone: editData.profile?.phone || '',
//                         address: editData.profile?.address || '',
//                         zipCode: e.target.value
//                       }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
//                   />
//                 ) : (
//                   <p className="text-gray-800">{studentData.profile?.zipCode || 'N/A'}</p>
//                 )}
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-[#34365C] mb-2">Bio</label>
//                 {isEditing ? (
//                   <textarea
//                     value={editData.profile?.bio || ''}
//                     onChange={(e) => setEditData({
//                       ...editData, 
//                       profile: {
//                         bio: e.target.value,
//                         phone: editData.profile?.phone || '',
//                         address: editData.profile?.address || '',
//                         zipCode: editData.profile?.zipCode || ''
//                       }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
//                     rows={4}
//                   />
//                 ) : (
//                   <p className="text-gray-800">{studentData.profile?.bio || 'N/A'}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'activities' && (
//           <div className="space-y-6">
//             {/* Skills Management */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-[#34365C]">My Skills & Interests</h2>
//                 <button className="px-4 py-2 bg-[#8387CC] text-white rounded-lg hover:bg-[#4169E1] transition-colors">
//                   + Add Skill
//                 </button>
//               </div>
//               {studentData.skills && studentData.skills.length > 0 ? (
//                 <div className="flex flex-wrap gap-3">
//                   {studentData.skills.map((skill, index) => (
//                     <div 
//                       key={index}
//                       className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full font-medium flex items-center gap-2"
//                     >
//                       {skill.name}
//                       <button className="text-red-500 hover:text-red-700 ml-1">×</button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No skills added yet. Click "Add Skill" to get started!</p>
//               )}
//             </div>

//             {/* Event History */}
//             {studentData.registeredEvents && studentData.registeredEvents.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm p-6">
//                 <h2 className="text-xl font-bold text-[#34365C] mb-4">Event History</h2>
//                 <div className="space-y-3">
//                   {studentData.registeredEvents.map((event, index) => (
//                     <div 
//                       key={index}
//                       className="p-4 bg-purple-50 rounded-lg border-2 border-[#DCD0FF]"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="font-semibold text-[#34365C]">Event #{event.eventId}</h4>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Registered: {new Date(event.registeredAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                           Registered
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'account' && (
//           <MyAccount student={studentData} />
//         )}

//         {activeTab === 'security' && (
//           <ChangePassword />
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from 'react';
import ChangePassword from '../_components/ChangePassword';
import MyAccount from '../_components/MyAccount';
import { Students, Schools } from '@/app/_data/data';

export default function StudentAccountPage() {
  // Use the first student from your data file as the logged-in user
  const [studentData, setStudentData] = useState(Students[0]);

  // Get the school name from schoolId
  const school = Schools.find(s => s.id === studentData.schoolId);
  const schoolName = school?.name || 'Unknown School';

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...studentData });
  
  const [isOwnProfile, setIsOwnProfile] = useState(true);

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <img 
                src={studentData.photoUrl} 
                alt={studentData.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#DCD0FF]"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#34365C]">{studentData.name}</h1>
                <p className="text-gray-600 mt-1">{studentData.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {schoolName} • Age {studentData.age}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {isOwnProfile && !isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#8387CC] text-white rounded-lg hover:bg-[#4169E1] transition-colors"
                >
                  Edit Profile
                </button>
              ) : isOwnProfile && isEditing ? (
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
              ) : null}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
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

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 text-sm">Events Registered</p>
                <p className="text-3xl font-bold text-[#8387CC]">{studentData.registeredEvents?.length || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 text-sm">Skills</p>
                <p className="text-3xl font-bold text-[#4169E1]">{studentData.skills?.length || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 text-sm">Followers</p>
                <p className="text-3xl font-bold text-green-600">{studentData.stats?.followers || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-600 text-sm">Following</p>
                <p className="text-3xl font-bold text-purple-600">{studentData.stats?.following || 0}</p>
              </div>
            </div>

            {/* My Skills */}
            {studentData.skills && studentData.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">My Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {studentData.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Registered Events */}
            {studentData.registeredEvents && studentData.registeredEvents.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">Registered Events</h2>
                <div className="space-y-3">
                  {studentData.registeredEvents.map((event, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-all"
                    >
                      <div>
                        <h4 className="font-semibold text-[#34365C]">Event #{event.eventId}</h4>
                        <p className="text-sm text-gray-600">
                          Registered on {new Date(event.registeredAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="px-4 py-2 text-[#8387CC] hover:text-[#4169E1] font-medium transition-colors">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bio Section */}
            {studentData.profile?.bio && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">About Me</h2>
                <p className="text-gray-700 leading-relaxed">{studentData.profile.bio}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
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
                  <p className="text-gray-800">{studentData.name}</p>
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
                  <p className="text-gray-800">{studentData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.profile?.phone || ''}
                    onChange={(e) => setEditData({
                      ...editData, 
                      profile: {
                        bio: editData.profile?.bio || '',
                        phone: e.target.value,
                        address: editData.profile?.address || '',
                        zipCode: editData.profile?.zipCode || ''
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                  />
                ) : (
                  <p className="text-gray-800">{studentData.profile?.phone || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">Age</label>
                <p className="text-gray-800">{studentData.age} years old</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">School</label>
                <p className="text-gray-800">{schoolName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#34365C] mb-2">Gender</label>
                <p className="text-gray-800">{studentData.sex}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#34365C] mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    value={editData.profile?.address || ''}
                    onChange={(e) => setEditData({
                      ...editData, 
                      profile: {
                        bio: editData.profile?.bio || '',
                        phone: editData.profile?.phone || '',
                        address: e.target.value,
                        zipCode: editData.profile?.zipCode || ''
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-800">{studentData.profile?.address || 'N/A'}</p>
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
                      profile: {
                        bio: editData.profile?.bio || '',
                        phone: editData.profile?.phone || '',
                        address: editData.profile?.address || '',
                        zipCode: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                  />
                ) : (
                  <p className="text-gray-800">{studentData.profile?.zipCode || 'N/A'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#34365C] mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editData.profile?.bio || ''}
                    onChange={(e) => setEditData({
                      ...editData, 
                      profile: {
                        bio: e.target.value,
                        phone: editData.profile?.phone || '',
                        address: editData.profile?.address || '',
                        zipCode: editData.profile?.zipCode || ''
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8387CC]"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-800">{studentData.profile?.bio || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            {/* Skills Management */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#34365C]">My Skills & Interests</h2>
                <button className="px-4 py-2 bg-[#8387CC] text-white rounded-lg hover:bg-[#4169E1] transition-colors">
                  + Add Skill
                </button>
              </div>
              {studentData.skills && studentData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {studentData.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full font-medium flex items-center gap-2"
                    >
                      {skill.name}
                      <button className="text-red-500 hover:text-red-700 ml-1">×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills added yet. Click "Add Skill" to get started!</p>
              )}
            </div>

            {/* Event History */}
            {studentData.registeredEvents && studentData.registeredEvents.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#34365C] mb-4">Event History</h2>
                <div className="space-y-3">
                  {studentData.registeredEvents.map((event, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-purple-50 rounded-lg border-2 border-[#DCD0FF]"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-[#34365C]">Event #{event.eventId}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Registered: {new Date(event.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Registered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'account' && (
          <MyAccount student={studentData} />
        )}

        {activeTab === 'security' && (
          <ChangePassword />
        )}
      </div>
    </div>
  );
}