"use client";

import { useState, useEffect, useRef } from "react";
import HelpCardsGrid from "./_components/HelpCardsGrid";
import Footer from "@/layout/Footer";
import Navbar from "@/layout/navibar";

type HelpType = "student" | "teacher" | "admin" | "resource" | null;

export default function NeedHelpPage() {
  const [activeHelp, setActiveHelp] = useState<HelpType>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const firstRender = useRef(true);

  /* ✅ Auto-scroll ONLY after user selects a card */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (activeHelp) {
      document
        .getElementById("faq-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeHelp]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* HERO with animated background */}
      <section className="relative w-full bg-gradient-to-br from-[#34365C] via-[#3d3f6b] to-[#34365C] text-white py-24 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-16 left-20 text-4xl opacity-20 animate-float">
            ✦
          </div>
          <div className="absolute top-32 right-32 text-5xl opacity-20 animate-float-delayed">
            ★
          </div>
          <div className="absolute bottom-20 left-1/3 text-3xl opacity-20 animate-float-slow">
            ✦
          </div>
          <div className="absolute bottom-24 right-24 text-4xl opacity-20 animate-float">
            ★
          </div>
          <div className="absolute top-1/2 left-1/4 text-2xl opacity-10 animate-float-delayed">
            ✦
          </div>
          <div className="absolute top-1/3 right-1/4 text-3xl opacity-10 animate-float-slow">
            ★
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <p className="text-sm text-[#DCD0FF] mb-4 animate-fade-in-down">
            Home · Need Help
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up">
            Need{" "}
            <span className="text-indigo-400 inline-block hover:scale-110 transition-transform duration-300">
              Help
            </span>
            ?
          </h1>

          <p className="max-w-3xl text-xl text-[#DCD0FF] opacity-90 animate-fade-in-up animation-delay-200">
            Choose your role below to view commonly asked questions.
          </p>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,50 Q300,100 600,50 T1200,50 L1200,120 L0,120 Z"
              fill="rgb(249 250 251)"
              opacity="0.1"
            ></path>
          </svg>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* Help Cards with stagger animation */}
        <div className="animate-fade-in-up animation-delay-300">
          <HelpCardsGrid
            activeHelp={activeHelp}
            onSelect={(type) => {
              setActiveHelp(type);
              setSearchQuery("");
            }}
          />
        </div>

        {/* FAQ Heading with slide-in effect */}
        <div className="mt-24 text-center animate-fade-in-up animation-delay-400">
          <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">
            Need quick answers?
          </p>
          <h2 className="text-3xl font-bold text-[#35355F] mt-3 bg-gradient-to-r from-[#35355F] to-indigo-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Search Bar with focus animation */}
        <div className="mt-8 max-w-md mx-auto animate-fade-in-up animation-delay-500">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search help topics..."
              className={`
                w-full px-5 py-4 rounded-2xl border-2 
                ${isSearchFocused ? "border-indigo-400 shadow-lg shadow-indigo-100" : "border-indigo-200"}
                focus:outline-none focus:ring-4 focus:ring-indigo-100
                transition-all duration-300 ease-out
                placeholder:text-gray-400
              `}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* FAQ PAPER with entrance animation */}
        <div
          id="faq-section"
          className="mt-16 animate-fade-in-up animation-delay-600"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#F4F1FF] to-white border-2 border-indigo-200 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-tr-full"></div>

            <div className="relative z-10">
              {renderFAQs(activeHelp, searchQuery)}
            </div>
          </div>
        </div>

        {/* Trust Signals with icon animation */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-600 animate-fade-in-up animation-delay-700">
          <div className="flex items-center gap-2 group hover:text-indigo-600 transition-colors duration-300">
            <span className="text-green-500 group-hover:scale-125 transition-transform duration-300">
              ✔
            </span>
            <span>Verified by educators</span>
          </div>
          <div className="flex items-center gap-2 group hover:text-indigo-600 transition-colors duration-300">
            <span className="text-green-500 group-hover:scale-125 transition-transform duration-300">
              ✔
            </span>
            <span>Secure & private</span>
          </div>
          <div className="flex items-center gap-2 group hover:text-indigo-600 transition-colors duration-300">
            <span className="text-green-500 group-hover:scale-125 transition-transform duration-300">
              ✔
            </span>
            <span>Student-first platform</span>
          </div>
        </div>
      </section>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes floatDelayed {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(-5deg);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
}

/* ---------- FAQ DATA & LOGIC ---------- */

const FAQ_DATA = {
  student: {
    title: "Student FAQs",
    faqs: [
      {
        q: "How do I create my student profile?",
        a: "Register and complete your profile details.",
      },
      {
        q: "How do I upload achievements?",
        a: "Profile → Add Achievement → Upload and submit.",
      },
      { q: "Can I edit an achievement?", a: "Yes, until reviewed." },
      { q: "Who can see my profile?", a: "Teachers and admins." },
      { q: "Is my data secure?", a: "Yes, fully protected." },
    ],
  },
  teacher: {
    title: "Teacher FAQs",
    faqs: [
      { q: "How do I verify students?", a: "Via the verification dashboard." },
      { q: "Do teachers verify achievements?", a: "No." },
      { q: "Can I reject a profile?", a: "Yes, with feedback." },
    ],
  },
  admin: {
    title: "School Admin FAQs",
    faqs: [
      { q: "How do I manage school data?", a: "Admin dashboard." },
      { q: "Can I manage teachers?", a: "Yes." },
    ],
  },
  resource: {
    title: "Resource FAQs",
    faqs: [
      { q: "Who can upload resources?", a: "Authorized users only." },
      { q: "Are resources reviewed?", a: "Yes." },
    ],
  },
};

function renderFAQs(type: HelpType, search: string) {
  let title = "General FAQs";
  let faqs = [
    { q: "What is All-Rounder?", a: "A student achievement platform." },
    { q: "Who can use this platform?", a: "Students, teachers, admins." },
    { q: "Is my data secure?", a: "Yes, fully protected." },
  ];

  if (type) {
    title = FAQ_DATA[type].title;
    faqs = FAQ_DATA[type].faqs;
  }

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-[#35355F] flex items-center gap-3">
        <span className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></span>
        {title}
      </h2>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <FAQ key={i} index={i} {...item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">🔍</div>
          <p className="text-gray-600 text-lg">No results found.</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search terms
          </p>
        </div>
      )}
    </>
  );
}

function FAQ({ q, a, index }: { q: string; a: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className="group bg-white rounded-xl border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 overflow-hidden hover:shadow-md"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`,
      }}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer font-semibold text-[#35355F] p-5 flex items-center justify-between list-none hover:bg-indigo-50/50 transition-colors duration-300">
        <span className="flex items-center gap-3 flex-1">
          <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
            {index + 1}
          </span>
          <span>{q}</span>
        </span>
        <svg
          className={`w-5 h-5 text-indigo-400 transition-transform duration-300 flex-shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        <p className="px-5 pb-5 pl-16 text-gray-700 leading-relaxed">{a}</p>
      </div>
    </details>
  );
}
