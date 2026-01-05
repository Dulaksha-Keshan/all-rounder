'use client';
import { Linkedin, Instagram, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#2a2c4e] via-[#34365C] to-[#3d3f6b] text-white w-full overflow-hidden -mb-1">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 pb-0">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-10">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center lg:items-start">
            <img 
              src="./logo.png" 
              alt="All-Rounder Logo" 
              className="h-24 w-auto brightness-0 invert mb-4 object-contain"
            />
            <p className="text-gray-200 text-base leading-relaxed max-w-sm text-center lg:text-left">
              Empowering students to explore, excel, and shine in every extra-curricular pursuit. Where passions meet opportunities.
            </p>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-xl font-bold mb-5 relative inline-block">
              Follow Us
              <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-[#8387CC] rounded-full"></span>
            </h3>
            <div className="space-y-3.5">
              <a
                href="https://www.linkedin.com/company/all-rounder-lk/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-200 hover:text-white hover:translate-x-1 transition-all duration-300 group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
                <span className="text-base">LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/allrounder_lk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-200 hover:text-white hover:translate-x-1 transition-all duration-300 group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-base">Instagram</span>
              </a>
              <a
                href="https://github.com/Dulaksha-Keshan/all-rounder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-200 hover:text-white hover:translate-x-1 transition-all duration-300 group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <span className="text-base">GitHub</span>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-xl font-bold mb-5 relative inline-block">
              Get in Touch
              <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-[#8387CC] rounded-full"></span>
            </h3>
            <div className="space-y-3.5">
              <a
                href="mailto:mail.allrounder.sdgp@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-200 hover:text-white hover:translate-x-1 transition-all duration-300 group"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-base">Email Us</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-7 pb-6">
          <p className="text-sm text-gray-300">
            © 2025 All-Rounder. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}