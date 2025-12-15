'use client';

import MeetOurTeam from './_components/MeetOurTeam';
import VisionHero from './_components/VisionHero';
import VisionCards from './_components/VisionCards';
import AboutAllRounder from './_components/AboutAllRounder';

export default function VisionPage() {
  return (
    <>
      {/* HERO */}
      <VisionHero />

      {/* VISION CARDS */}
      <section className="bg-gray-100 px-6 py-20">
        <VisionCards />
      </section>

      {/* ABOUT ALL-ROUNDER */}
      <section>
        <AboutAllRounder />
      </section>

      {/* MEET OUR TEAM */}
      <section className="max-w-6xl mx-auto mt-20">
        <MeetOurTeam />
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-[#34365C] to-[#4169E1] text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand */}
            <div>
              <img
                src="logo.png"
                alt="All-Rounder Logo"
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Overview</a></li>
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">For Students</a></li>
                <li><a href="#" className="hover:text-white">For Educators</a></li>
                <li><a href="#" className="hover:text-white">For Schools</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Getting Started</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span>📧</span>
                  <a
                    href="mailto:allrounder@gmail.com"
                    className="hover:text-white"
                  >
                    allrounder@gmail.com
                  </a>
                </li>
                <li className="flex gap-3">
                  <span>📍</span>
                  <span>
                    123 Education Lane <br />
                    San Francisco, CA
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-200 text-center">
            © 2024 All-Rounder. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
