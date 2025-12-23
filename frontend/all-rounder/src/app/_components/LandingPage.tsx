
import {  Trophy, Palette, Users } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { EventDetails } from './Events';
import { HeroSection } from './Hero';

export default function LandingPage() {
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
                <a href="#" className="px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-m font-medium">Overview</a>
                <a href="#" className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-m">How it works</a>
                <a href="#" className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-m">For students</a>
                <a href="#" className="px-3 py-1.5 text-gray-600 hover:text-gray-900 text-m">For educators</a>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 text-m font-medium">Log in</button>
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-m font-medium hover:bg-indigo-700">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      <HeroSection/>

        {/* Our Vision & Mission */}
    
      <div className="m-16 mt-20">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-[#34365C] mb-2">Our Vision & Mission</h2>
          <p className="text-gray-600 text-xl">Empowering students to showcase their unique journey through three core pillars that define our platform.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Create */}
          <div className="bg-purple-100 rounded-xl p-8 shadow-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-all hover:shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-2xl flex items-center justify-center mb-6">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#34365C] mb-4">Create</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4 text-[18px]">
              Build a comprehensive digital portfolio that captures every facet of your student journey. From achievements to creative projects and leadership all in one powerful profile.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full text-sm font-medium">BUILD</span>
              <span className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full text-sm font-medium">SHOWCASE</span>
            </div>
          </div>

            {/* Contribute */}
          <div className="bg-purple-100 rounded-xl p-8 shadow-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-all hover:shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#34365C] mb-4">Contribute</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4 text-[18px]">
              Share your voice, and experiences with a vibrant community. Engage meaningfully through our social feed, support peers, and contribute to a collaborative environment.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full text-sm font-medium">CONNECT</span>
              <span className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full text-sm font-medium">ENGAGE</span>
            </div>
          </div>

          {/* Celebrate */}
          <div className="bg-purple-100 rounded-xl p-8 shadow-lg border-2 border-[#DCD0FF] hover:border-[#8387CC] transition-all hover:shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8387CC] to-[#4169E1] rounded-2xl flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#34365C] mb-4">Celebrate</h3>
            <p className="text-justify text-gray-700 leading-relaxed mb-4 text-[18px]">
              Recognize and honor every milestone. Get verified recognition from educators, climb leaderboards, and receive the acknowledgment you deserve for your hard work and dedication.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full text-sm font-medium">ACHIEVE</span>
              <span className="px-4 py-2 bg-[#DCD0FF] text-[#505485] rounded-full text-sm font-medium">RECOGNIZE</span>
            </div>
            
          </div>
            
        </div>
        <div className='flex justify-center mt-5'>
        <button className="px-9 py-3 bg-[#8387CC] text-white rounded-lg text-lg font-medium hover:bg-[#4169E1] mt-5">
          → Learn More
        </button>
        </div>
      </div>

        {/* Explore Our Features Section */}

      <div className="mb-16 mt-0">
        <FeatureCard />
      </div>

        {/* Built for students section */}
      <div className="mb-16 m-16">
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
              For Students
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
              For Teachers
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
            For Schools
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

       {/* Explore Our Events Section */}
        
       <EventDetails/>

  
      <footer className="bg-gradient-to-br from-[#34365C] to-[#4169E1] text-white">
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
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">Overview</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">How it Works</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">For Students</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">For Educators</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">For Schools</a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">Help Center</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">Getting Started</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">Blog</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-m">Terms of Service</a>
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
                    <p className="text-m text-gray-200">Email</p>
                    <a href="mailto:support@studentprofiles.com" className="text-sm text-gray-300 hover:text-white transition-colors">
                      allrounder@gmail.com
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <span className="text-[#DCD0FF] text-lg">📍</span>
                  <div>
                    <p className="text-m text-gray-200"></p>
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

