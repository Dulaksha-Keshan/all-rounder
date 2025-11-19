
import { Camera, Trophy, Palette, Award, MessageSquare, Users } from 'lucide-react';

export default function StudentProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <div className="flex items-center">
                <img src="logo.png" alt="Logo" className="h-8 w-auto" />
              </div>
              <nav className="hidden md:flex items-center space-x-7">
                <a href="#" className="px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">Overview</a>
                <a href="#" className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm">How it works</a>
                <a href="#" className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm">For students</a>
                <a href="#" className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm">For educators</a>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">Log in</button>
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div className="space-y-6">
            {/* Staggered Heading */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Show the full story
              </h1>
              <h1 className="text-5xl md:text-6xl font-bold text-indigo-600 leading-tight pl-8">
                of who you are
              </h1>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight pl-16">
                beyond grades
              </h1>
            </div>

            <p className="text-lg text-gray-600 pl-4">
              Your journey deserves to be seen. Build a profile that transforms your achievements, passions, and experiences into a powerful first impression.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pl-4">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center shadow-lg hover:shadow-xl transition-all">
                <span>📝 Make your first submission</span>
              </button>
              <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 flex items-center transition-all">
                <span>💬 Explore newsfeed</span>
              </button>
            </div>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-3 pt-4 pl-4">
              <span className="px-5 py-2.5 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-base font-medium inline-flex items-center shadow-sm">
                🏆 Achievements & highlights
              </span>
              <span className="px-5 py-2.5 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-full text-base font-medium inline-flex items-center shadow-sm">
                👥 Clubs & organizations
              </span>
              <span className="px-5 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-base font-medium inline-flex items-center shadow-sm">
                ✨ All in one platform
              </span>
            </div>
          </div>
          
          {/* Avatar/Sticker Image */}
          <div className="flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
              <img 
                src="Avatar.png" 
                alt="Student Avatar"
                className="relative w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* One profile, four ways to shine */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">One profile, four ways to shine</h2>
              <p className="text-gray-600">Make an impact. Be visible. Be a leader. Capture it all. Meet a flexible method to visualize the complete you.</p>
            </div>
            <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200">
              → Create a submission
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Achievements</h3>
              <p className="text-sm text-gray-600 mb-4">
                Include: community involvement, awards, trophies, volunteering, activism, and anything meaningful beyond the classroom.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">COMMUNITY</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">VOLUNTEERING</span>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Portfolio</h3>
              <p className="text-sm text-gray-600 mb-4">
                Showcase your creativity, design skills, photography, writing, or anything artistic you want to share.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">DESIGN WORK</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">PROJECTS</span>
              </div>
            </div>

            {/* Honors & Certifications */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Honors & Certifications</h3>
              <p className="text-sm text-gray-600 mb-4">
                List AP classes, Honors courses, technical licenses (OSHA, CDL), or certifications like CPR or CNA.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">HONORS</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">CERTIFICATIONS</span>
              </div>
            </div>

            {/* Engaging Voice Feed */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Engaging Voice Feed</h3>
              <p className="text-sm text-gray-600 mb-4">
                Share insights, personal stories, thoughts, passions, advice or commentary—just be authentic and be yourself.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">SHARING</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">CONNECTING</span>
              </div>
            </div>

            {/* Leader-organizer */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Leader-organizer</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you on a team? Run a club? Organize your community? Lead something? Show leadership and organizational skills here.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">CLUBS & SPORTS</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">ORGANIZATIONS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Built for students section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Built for students, trusted by teachers</h2>
          <p className="text-gray-600 mb-8">
            Learn how student profiles help teachers guide students, help parents track accomplishments, and assist students in tracking their own progress and planning their future.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">📚 For students</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-sm text-gray-700">
                  <span className="mr-2">✓</span>
                  <span>Set, cultivate, & nurture a detailed record of accomplishments</span>
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="mr-2">✓</span>
                  <span>Track your efforts & achievements</span>
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="mr-2">✓</span>
                  <span>Use it with a college admissions coach</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">👨‍🏫 For teachers</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-sm text-gray-700">
                  <span className="mr-2">✓</span>
                  <span>View, curate, and recognize students who inspire</span>
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="mr-2">✓</span>
                  <span>Approve student's activity as a school teacher</span>
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="mr-2">✓</span>
                  <span>Take on an inclusive, fun, social layer</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">✅ Verified by many but one</h3>
              <p className="text-sm text-gray-700 mb-4">
                Stay up-to-date with all published student activity, verified by a single advisor per student at a time (such as a guidance counselor).
              </p>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-700">
                  <span className="mr-2">✓</span>
                  <span>Verify only one</span>
                </li>
                <li className="flex items-start text-sm text-gray-700">
                  <span className="mr-2">✓</span>
                  <span>No PII or data leakage</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* App looks like section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What your day inside the app looks like</h2>
              <p className="text-gray-600">
                All of the good things about an activity feed: build, write, see, like, react, share and learn from each other — all in one page.
              </p>
            </div>
            <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200">
              ⚡ Jumpstart to great student
            </button>
          </div>

          <div className="space-y-6">
            {/* Sample Posts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-pink-200 rounded-full mr-3 flex items-center justify-center text-lg">👤</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Madeline Clark • Clarke Clow—galena</h4>
                  <p className="text-sm text-gray-500">Uploaded via Google Drive • 2hr ago</p>
                </div>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">🌟 Achievement</button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&h=400&fit=crop" 
                alt="Student activity" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">COMMUNITY</span>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">VOLUNTEERING</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-blue-200 rounded-full mr-3 flex items-center justify-center text-lg">👤</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Digital Lens • Greater Gerou</h4>
                  <p className="text-sm text-gray-500">Comment on Essay • 3hr ago</p>
                </div>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">📝 Portfolio</button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop" 
                alt="Digital work" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">STUDENT ART</span>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">DESIGN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher tools section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Teacher tools are built in</h2>
              <p className="text-gray-600">
                Track actions and engagement, to approve or verify activities and guide students on crafting smarter, stronger profiles they can truly be proud of.
              </p>
            </div>
            <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200">
              📝 Setup a guided tutorial
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-amber-200 rounded-full mr-4 flex items-center justify-center text-xl">👨‍🏫</div>
              <div>
                <h3 className="font-semibold text-gray-900">Mr. Jordan Lee</h3>
                <p className="text-sm text-gray-500">English teacher & club advisor</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-2xl font-bold text-gray-900">5,487</p>
                <p className="text-sm text-gray-600">Posts of activities</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2.3K</p>
                <p className="text-sm text-gray-600">Comments and feedback</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2.1M</p>
                <p className="text-sm text-gray-600">Interactions (shares + likes)</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Approved posts</p>
                <p className="text-xs text-gray-500">3 today</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Review ready</p>
                <p className="text-xs text-gray-500">Feedbacks to review, review comments and tips</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Data usage</p>
                <p className="text-xs text-gray-500">You've used 31% of 100GB this month</p>
              </div>
            </div>

            <div className="mt-6 bg-indigo-600 text-white rounded-xl p-6 flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">Ready to explore the teacher side?</h4>
                <p className="text-sm text-indigo-100">
                  Setup a teacher or supervisor profile of your class or club—right there on our app, at no cost.
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-50 flex items-center whitespace-nowrap ml-4">
                📚 Guide me
              </button>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">You're in. Meet apps made your profile feel like you.</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Whether a college finds you on the app or you share your link or profile code with them, make a great first impression with a profile that tells a richer story that stands out and set you apart.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-50">
              🏠 Go to Teams room
            </button>
            <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-400">
              → Complete the profile
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>© Student Profiles 2024, All rights to student's content is within our privacy policy</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}