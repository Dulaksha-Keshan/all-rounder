
import { Student, Teacher } from "@/app/_type/type";


interface MyAccountProps {
  student?: Student;
  teacher?: Teacher;
}

export default function MyAccount({ student, teacher }: MyAccountProps) {
  // Use whichever prop is provided
  const user = student || teacher;
  const userType = student ? 'student' : 'teacher';

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Account Overview */}
      <div className="bg-[var(--white)] rounded-xl p-6 shadow-sm border border-[var(--gray-200)] transition-colors duration-300">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Account Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-[var(--gray-200)]">
            <div>
              <h4 className="font-semibold text-[var(--text-main)]">Account Status</h4>
              <p className="text-sm text-[var(--text-muted)] font-medium">Your account is active and verified</p>
            </div>
            <span className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-sm font-bold">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-[var(--gray-200)]">
            <div>
              <h4 className="font-semibold text-[var(--text-main)]">Email Verification</h4>
              <p className="text-sm text-[var(--text-muted)] font-medium">{user.email}</p>
            </div>
            <span className="px-4 py-2 bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] rounded-full text-sm font-bold">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h4 className="font-semibold text-[#34365C]">School</h4>

              {/* <p className="text-sm text-gray-600">{user.school}</p> */}


            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <h4 className="font-semibold text-[var(--text-main)]">Member Since</h4>
              <p className="text-sm text-[var(--text-muted)] font-medium">January 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="bg-[var(--white)] rounded-xl p-6 shadow-sm border border-[var(--gray-200)]">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Account Statistics</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[var(--primary-purple)]/10 rounded-lg">
            <p className="text-3xl font-bold text-[var(--primary-purple)] mb-2">
              {user.registeredEvents?.length || 0}
            </p>
            <p className="text-sm text-[var(--text-muted)] font-bold">Registered Events</p>
          </div>

          {/* Only show followers/following for students */}
          {userType === 'student' && student && (
            <>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-[#8387CC] mb-2">
                  {student.stats?.followers || 0}
                </p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-[#8387CC] mb-2">
                  {student.stats?.following || 0}
                </p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </>
          )}

          {/* Show alternative stats for teachers */}
          {userType === 'teacher' && (
            <>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Subject</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-[#8387CC] mb-2">
                  {user.sex}
                </p>
                <p className="text-sm text-gray-600">Gender</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-[var(--white)] rounded-xl p-6 shadow-sm border border-[var(--gray-200)]">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Privacy & Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h4 className="font-semibold text-[#34365C]">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 bg-[#8387CC] text-white rounded-lg hover:bg-[#4169E1] transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-[var(--gray-200)]">
            <div>
              <h4 className="font-semibold text-[var(--text-main)]">Profile Visibility</h4>
              <p className="text-sm text-[var(--text-muted)] font-medium">Control who can see your profile</p>
            </div>
            <select className="px-4 py-2 border border-[var(--gray-200)] bg-[var(--white)] text-[var(--text-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]">
              <option>Public</option>
              <option>Friends Only</option>
              <option>Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <h4 className="font-semibold text-[var(--text-main)]">Activity Status</h4>
              <p className="text-sm text-[var(--text-muted)] font-medium">Show when you're active</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DCD0FF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8387CC]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Registered Events */}
      {user.registeredEvents && user.registeredEvents.length > 0 && (
        <div className="bg-[var(--white)] rounded-xl p-6 shadow-sm border border-[var(--gray-200)]">
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Registered Events</h3>
          <div className="space-y-3">
            {user.registeredEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[var(--primary-blue)]/5 rounded-lg border border-[var(--gray-200)]"
              >
                <div>
                  <h4 className="font-semibold text-[var(--text-main)]">Event #{event.eventId}</h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    Registered on {new Date(event.registeredAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="px-4 py-2 text-[#8387CC] hover:text-[#4169E1] font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-[var(--white)] rounded-xl p-6 shadow-sm border-2 border-red-500/20">
        <h3 className="text-xl font-bold text-red-500 mb-6">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-[var(--gray-200)]">
            <div>
              <h4 className="font-semibold text-[var(--text-main)]">Deactivate Account</h4>
              <p className="text-sm text-[var(--text-muted)] font-medium">Temporarily disable your account</p>
            </div>
            <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
              Deactivate
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <h4 className="font-semibold text-[var(--text-main)]">Delete Account</h4>
              <p className="text-sm text-[var(--text-muted)] font-medium">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
