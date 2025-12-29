// 'use client';
// import { Linkedin, Instagram, Github, Mail } from 'lucide-react';

// export default function Footer() {
//   return (
//     <footer className="bg-[#34365C] text-white w-full">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

//         {/* Top Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

//           {/* Logo */}
//           <div className="flex flex-col items-center text-center">
//             <img 
//               src="logo.png" 
//               alt="All-Rounder Logo" 
//               className="h-32 sm:h-50 w-auto brightness-0 invert mb-6"
//             />
//           </div>

//           {/* Follow Us */}
//           <div className="flex flex-col items-center sm:items-start">
//             <h3 className="text-lg font-bold mb-4">Follow Us</h3>
//             <ul className="space-y-3">
//               <li>
//                 <a
//                   href="https://www.linkedin.com/company/all-rounder-lk/posts/?feedView=all"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 text-gray-300 hover:text-white transition"
//                 >
//                   <Linkedin className="w-5 h-5" /> LinkedIn
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://www.instagram.com/allrounder_lk"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 text-gray-300 hover:text-white transition"
//                 >
//                   <Instagram className="w-5 h-5" /> Instagram
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://github.com/Dulaksha-Keshan/all-rounder"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 text-gray-300 hover:text-white transition"
//                 >
//                   <Github className="w-5 h-5" /> GitHub
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Contact */}
//           <div className="flex flex-col items-center sm:items-start">
//             <h3 className="text-lg font-bold mb-4">Contact Us</h3>
//             <div className="flex items-start gap-3">
//               <Mail className="w-5 h-5 text-[#DCD0FF] mt-1" />
//               <div>
//                 <a
//                   href="mailto:allrounder@gmail.com"
//                   className="text-gray-300 hover:text-white transition break-all"
//                 >
//                   allrounder@gmail.com
//                 </a>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Divider */}
//         <div className="border-t border-white/20 mt-10 pt-6">
//           <p className="text-sm text-gray-100 text-center">
//             © 2024 All-Rounder. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }


'use client';
import { Linkedin, Instagram, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#2a2c4e] via-[#34365C] to-[#3d3f6b] text-white w-full overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <img 
              src="logo.png" 
              alt="All-Rounder Logo" 
              className="h-28 w-auto brightness-0 invert mb-3 object-contain"
            />
            <p className="text-gray-200 text-sm leading-relaxed max-w-md">
              Empowering students to explore, excel, and shine in every extra-curricular pursuit. Where passions meet opportunities.
            </p>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              Follow Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#8387CC] rounded-full"></span>
            </h3>
            <div className="space-y-3">
              <a
                href="https://www.linkedin.com/company/all-rounder-lk/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-200 hover:text-white hover:translate-x-1 transition-all duration-300 group"
              >
                <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/allrounder_lk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-200 hover:text-white hover:translate-x-1 transition-all duration-300 group"
              >
                <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Instagram className="w-4 h-4" />
                </div>
                <span className="text-sm">Instagram</span>
              </a>
              <a
                href="https://github.com/Dulaksha-Keshan/all-rounder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-200 hover:text-white hover:translate-x-1 transition-all duration-300 group"
              >
                <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                  <Github className="w-4 h-4" />
                </div>
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              Get in Touch
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#DCD0FF] rounded-full"></span>
            </h3>
            <a
              href="mailto:allrounder@gmail.com"
              className="flex items-start gap-3 text-gray-200 hover:text-white transition-all duration-300 group"
            >
              <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block text-xs font-medium mb-0.5">Email us</span>
                <span className="block text-sm break-all">allrounder@gmail.com</span>
              </div>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6">
          <p className="text-xs text-gray-300">
            © 2024 All-Rounder. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}