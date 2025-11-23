
import { Camera, Trophy, Palette, Award, MessageSquare, Users } from 'lucide-react';
import FeatureCard from './_components/FeatureCard';
import { EventDetails } from './_components/Events';
import { HeroSection } from './_components/Hero';

export default function StudentProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100"> 
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <div className="flex items-center">
                <img src="logo.png" alt="Logo" className="h-15 w-auto" />
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
      {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> */}
        {/* Hero Section */}
        {/* <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div className="space-y-6"> */}
            {/* Staggered Heading */}
            {/* <div className="space-y-2">
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
            </p> */}

            {/* CTA Buttons */}
            {/* <div className="flex flex-wrap gap-3 pl-4">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center shadow-lg hover:shadow-xl transition-all">
                <span> Make your first submission</span>
              </button>
              <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 flex items-center transition-all">
                <span> Explore newsfeed</span>
              </button>
            </div> */}

            {/* Feature Tags */}
            {/* <div className="flex flex-wrap gap-3 pt-4 pl-4">
              <span className="px-5 py-3 bg-purple-200 rounded-full text-base font-medium inline-flex items-center shadow-sm">
                 Achievements & highlights
              </span>
              <span className="px-5 py-3 bg-purple-200  rounded-full text-base font-medium inline-flex items-center shadow-sm">
                Clubs & organizations
              </span>
              <span className="px-5 py-3 bg-purple-200  rounded-full text-base font-medium inline-flex items-center shadow-sm">
               All in one platform
              </span>
            </div>
          </div> */}
          
          {/* Avatar/Sticker Image */}
          {/* <div className="flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
              <img 
                src="Avatar.png" 
                alt="Student Avatar"
                className="relative w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div> */}
        <HeroSection/>

        {/* Our Vision & Mission */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Vision & Mission</h2>
              <p className="text-gray-600">Empowering students to showcase their unique journey through three core pillars that define our platform.</p>
            </div>
            <button className="px-4 py-2 bg-[#8387CC] text-white rounded-lg text-sm font-medium hover:bg-[#4169E1]">
              → Learn More
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Create */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-2xl flex items-center justify-center mb-6">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#34365C] mb-4">Create</h3>
              <p className="text-justify text-gray-600 leading-relaxed mb-4">
                Build a comprehensive digital portfolio that captures every facet of your student journey. From achievements and certifications to creative projects and leadership all in one powerful profile.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-[#DCD0FF] text-[#8387CC] rounded-full text-sm font-medium">BUILD</span>
                <span className="px-4 py-2 bg-[#DCD0FF] text-[#8387CC] rounded-full text-sm font-medium">SHOWCASE</span>
              </div>
            </div>

            {/* Contribute */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#34365C] mb-4">Contribute</h3>
              <p className="text-justify text-gray-600 leading-relaxed mb-4">
                Share your voice, and experiences with a vibrant community. Engage meaningfully through our social feed, support peers, exchange knowledge, and contribute to a collaborative learning environment.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-[#DCD0FF] text-[#8387CC] rounded-full text-sm font-medium">CONNECT</span>
                <span className="px-4 py-2 bg-[#DCD0FF] text-[#8387CC] rounded-full text-sm font-medium">ENGAGE</span>
              </div>
            </div>

            {/* Celebrate */}
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#34365C] mb-4">Celebrate</h3>
              <p className="text-justify text-gray-600 leading-relaxed mb-4">
                Recognize and honor every milestone. Get verified recognition from educators, climb leaderboards, earn achievements, and receive the acknowledgment you deserve for your hard work and dedication.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-[#DCD0FF] text-[#8387CC] rounded-full text-sm font-medium">ACHIEVE</span>
                <span className="px-4 py-2 bg-[#DCD0FF] text-[#8387CC] rounded-full text-sm font-medium">RECOGNIZE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <FeatureCard />
        </div>

        {/* Explore Our Events Section */}
        
        <EventDetails/>

        {/* Built for students section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-[#34365C] mb-4 text-center">
            Empowering Every Stakeholder
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Learn how student profiles help teachers guide students, help parents track accomplishments, and assist students in tracking their own progress and planning their future.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* For Students */}
            <div className="bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-[#8387CC]/20">
              <h3 className="text-2xl font-bold text-[#34365C] mb-6 flex items-center gap-3">
                <span className="text-3xl">📚</span> For Students
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Set, cultivate, & nurture a detailed record of accomplishments</span>
                </li>
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Track your efforts & achievements over time</span>
                </li>
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Use it with college admissions coaches and advisors</span>
                </li>
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Build a portfolio that tells your complete story</span>
                </li>
              </ul>
            </div>

            {/* For Teachers */}
            <div className="bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-[#8387CC]/20">
              <h3 className="text-2xl font-bold text-[#34365C] mb-6 flex items-center gap-3">
                <span className="text-3xl">👨‍🏫</span> For Teachers
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>View, curate, and recognize students who inspire</span>
                </li>
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Approve and verify student activities efficiently</span>
                </li>
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Foster an inclusive, engaging social learning layer</span>
                </li>
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Guide students in crafting stronger profiles</span>
                </li>
              </ul>
            </div>

            {/* For Schools */}
            <div className="bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-[#8387CC]/20">
              <h3 className="text-2xl font-bold text-[#34365C] mb-6 flex items-center gap-3">
                <span className="text-3xl">🏫</span> For Schools
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Streamline verification with a single advisor system</span>
                </li>
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Ensure data privacy with no PII leakage</span>
                </li>
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Monitor student engagement and achievements</span>
                </li>
                <li className="flex items-start text-base text-[#34365C]">
                  <span className="mr-3 text-[#8387CC] font-bold text-lg">✓</span>
                  <span>Build a culture of recognition and excellence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      {/* </main> */}

      <footer className="bg-gradient-to-br from-[#34365C] to-[#4169E1] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="col-span-1">
              <img src="logo.png" alt="Student Profiles Logo" className="h-45 w-auto mb-4 brightness-0 invert" />
          
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Overview</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">How it Works</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">For Students</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">For Educators</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">For Schools</a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Help Center</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Getting Started</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Blog</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Terms of Service</a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#DCD0FF] text-lg">📧</span>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <a href="mailto:support@studentprofiles.com" className="text-sm text-gray-300 hover:text-white transition-colors">
                      support@studentprofiles.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DCD0FF] text-lg">📞</span>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <a href="tel:+1234567890" className="text-sm text-gray-300 hover:text-white transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DCD0FF] text-lg">📍</span>
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm text-gray-300">
                      123 Education Lane<br />
                      San Francisco, CA 94102
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-100 text-center md:text-center">
            © 2024 Student Profiles. All rights reserved. Your content is protected under our privacy policy.
          </p>
            
        </div>
      </footer>
    </div>
  );
}

