"use client";

import { useState, useEffect, useRef } from "react";
import HelpCardsGrid from "./_components/HelpCardsGrid";
import Footer from "@/app/_components/Footer";
import Navbar from '../_components/navibar';

type HelpType = "student" | "teacher" | "admin" | "resource" | null;

export default function NeedHelpPage() {
  const [activeHelp, setActiveHelp] = useState<HelpType>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeHelp]);

  return (
    <div className="bg-gray-50">
      {/* HEADER */}
      <Navbar />
      {/* HERO */}
      <section className="relative w-full bg-[#34365C] text-white py-20 overflow-hidden">
        {/* Decorative stars */}
        <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-20 text-4xl opacity-20">✦</div>
        <div className="absolute top-32 right-32 text-5xl opacity-20">★</div>
        <div className="absolute bottom-20 left-1/3 text-3xl opacity-20">✦</div>
        <div className="absolute bottom-24 right-24 text-4xl opacity-20">★</div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
          <p className="text-sm text-[#DCD0FF] mb-4">
            Home · Need Help
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            Need <span className="text-indigo-400">Help</span>?
          </h1>

          <p className="max-w-3xl text-xl text-[#DCD0FF] opacity-90">
            Choose your role below to view commonly asked questions.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* Help Cards */}
        <HelpCardsGrid
          activeHelp={activeHelp}
          onSelect={(type) => {
            setActiveHelp(type);
            setSearchQuery("");
          }}
        />

        {/* FAQ Heading */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            Need quick answers?
          </p>
          <h2 className="text-2xl font-semibold text-[#35355F] mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Search Bar (ALWAYS visible) */}
        <div className="mt-6 max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help topics..."
            className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* FAQ PAPER (ALWAYS visible) */}
        <div id="faq-section" className="mt-16">
          <div className="max-w-4xl mx-auto bg-[#F4F1FF] border border-indigo-200 rounded-2xl p-10">
            {renderFAQs(activeHelp, searchQuery)}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 flex justify-center gap-10 text-sm text-gray-500">
          <div>✔ Verified by educators</div>
          <div>✔ Secure & private</div>
          <div>✔ Student-first platform</div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

/* ---------- FAQ DATA & LOGIC ---------- */

const FAQ_DATA = {
  student: {
    title: "Student FAQs",
    faqs: [
      { q: "How do I create my student profile?", a: "Register and complete your profile details." },
      { q: "How do I upload achievements?", a: "Profile → Add Achievement → Upload and submit." },
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
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-[#35355F]">{title}</h2>

      {filtered.length ? (
        filtered.map((item, i) => <FAQ key={i} {...item} />)
      ) : (
        <p className="text-gray-600">No results found.</p>
      )}
    </>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="mb-4">
      <summary className="cursor-pointer font-medium text-[#35355F]">
        {q}
      </summary>
      <p className="mt-2 text-gray-700">{a}</p>
    </details>
  );
}
